import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetePassword: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {
	beforeEach(() => {
		fakeRepository = new FakeUsersRepository();
		fakeUserTokensRepository = new FakeUserTokensRepository();
		fakeHashProvider = new FakeHashProvider();
		resetePassword = new ResetPasswordService(
			fakeRepository,
			fakeUserTokensRepository,
			fakeHashProvider,
		);
	});

	it('should be able to reset password', async () => {
		const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

		const user = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const userToken = await fakeUserTokensRepository.generate(user.id);

		await resetePassword.execute({
			token: userToken.token,
			password: 'mudou123',
		});

		const updatedUser = await fakeRepository.findById(user.id);

		expect(updatedUser?.password).toBe('mudou123');
		expect(generateHash).toBeCalledWith('mudou123');
	});

	it('should be not able to reset password if token does not exists', async () => {
		await expect(
			resetePassword.execute({
				token: 'non-existing-token',
				password: 'mudou123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should be not able to reset password if the user does not exists', async () => {
		const userToken = await fakeUserTokensRepository.generate(
			'non-existing-user',
		);

		await expect(
			resetePassword.execute({
				token: userToken.token,
				password: 'mudou123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to reset password if past 2 hours', async () => {
		const user = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const userToken = await fakeUserTokensRepository.generate(user.id);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			const customDate = new Date();

			return customDate.setHours(customDate.getHours() + 3);
		});

		await expect(
			resetePassword.execute({
				token: userToken.token,
				password: 'mudou123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
