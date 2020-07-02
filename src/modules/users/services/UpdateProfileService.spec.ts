import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeRepository: FakeUsersRepository;
let fakeHash: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
	beforeEach(() => {
		fakeRepository = new FakeUsersRepository();
		fakeHash = new FakeHashProvider();
		updateProfile = new UpdateProfileService(fakeRepository, fakeHash);
	});

	it('should be able to update user profile', async () => {
		const user = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'Teste ts surname',
			email: 'email@email.com',
		});

		expect(updatedUser.name).toEqual('Teste ts surname');
	});

	it('should not be able to change non-existing user', async () => {
		await expect(
			updateProfile.execute({
				user_id: 'Non-Existing user_id',
				name: 'Teste ts surname',
				email: 'email@email.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to change to another user email', async () => {
		await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const user = await fakeRepository.create({
			name: 'Teste 2 ts',
			email: 'email.teste@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'Teste ts surname',
				email: 'email@email.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should be able to update user password', async () => {
		const user = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'Teste ts surname',
			email: 'email@email.com',
			old_password: 'HASdASDHJasAHSDdashewhrh',
			password: '123456',
		});

		expect(updatedUser.password).toEqual('123456');
	});

	it('should not be able to update user password without old_password', async () => {
		const user = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'Teste ts surname',
				email: 'email@email.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to update user password with wrong old_password', async () => {
		const user = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'Teste ts surname',
				email: 'email@email.com',
				old_password: '123456',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
