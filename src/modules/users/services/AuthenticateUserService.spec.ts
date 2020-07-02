import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
	beforeEach(() => {
		fakeRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		fakeCacheProvider = new FakeCacheProvider();
		createUser = new CreateUserService(
			fakeRepository,
			fakeHashProvider,
			fakeCacheProvider,
		);
	});
	it('should be able to authenticate', async () => {
		const authUser = new AuthenticateUserService(
			fakeRepository,
			fakeHashProvider,
		);

		const user = await createUser.execute({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const response = await authUser.execute({
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		expect(response).toHaveProperty('token');
		expect(response.user).toEqual(user);
	});

	it('should not be able to authenticate with non exitent user', async () => {
		const authUser = new AuthenticateUserService(
			fakeRepository,
			fakeHashProvider,
		);

		await expect(
			authUser.execute({
				email: 'email@email.com',
				password: 'HASdASDHJasAHSDdashewhrh',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to authenticate with wrong password', async () => {
		const authUser = new AuthenticateUserService(
			fakeRepository,
			fakeHashProvider,
		);

		await createUser.execute({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		await expect(
			authUser.execute({
				email: 'email@email.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
