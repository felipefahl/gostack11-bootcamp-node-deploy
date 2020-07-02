import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

let fakeRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
	beforeEach(() => {
		fakeRepository = new FakeUsersRepository();
		showProfile = new ShowProfileService(fakeRepository);
	});

	it('should be able to show user profile', async () => {
		const user = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const showUser = await showProfile.execute({
			user_id: user.id,
		});

		expect(showUser.name).toEqual('Teste ts');
		expect(showUser.email).toEqual('email@email.com');
	});

	it('should not be able to change non-existing user', async () => {
		await expect(
			showProfile.execute({
				user_id: 'Non-Existing user_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
