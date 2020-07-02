import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
	beforeEach(() => {
		fakeRepository = new FakeUsersRepository();
		fakeMailProvider = new FakeMailProvider();
		fakeUserTokenRepository = new FakeUserTokensRepository();
		sendForgotPasswordEmail = new SendForgotPasswordEmailService(
			fakeRepository,
			fakeUserTokenRepository,
			fakeMailProvider,
		);
	});

	it('should be able to recover the password using the email', async () => {
		const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

		await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		await sendForgotPasswordEmail.execute({ email: 'email@email.com' });

		expect(sendMail).toHaveBeenCalled();
	});

	it('should not be able to recover a non-existing user', async () => {
		await expect(
			sendForgotPasswordEmail.execute({ email: 'email@email.com' }),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should generate a forgot password token', async () => {
		const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

		const user = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		await sendForgotPasswordEmail.execute({ email: 'email@email.com' });

		expect(generateToken).toHaveBeenCalledWith(user.id);
	});
});
