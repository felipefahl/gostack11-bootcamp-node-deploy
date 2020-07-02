import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
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
	it('should be able to create a new user', async () => {
		const user = await createUser.execute({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		expect(user).toHaveProperty('id');
		expect(user.email).toBe('email@email.com');
	});

	it('should not be able to create a new user with same email', async () => {
		await createUser.execute({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		await expect(
			createUser.execute({
				name: 'Teste ts',
				email: 'email@email.com',
				password: 'HASdASDHJasAHSDdashewhrh',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
