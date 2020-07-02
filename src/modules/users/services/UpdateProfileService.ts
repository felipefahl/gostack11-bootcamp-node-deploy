import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface IRequest {
	user_id: string;
	name: string;
	email: string;
	old_password?: string;
	password?: string;
}

@injectable()
class UpdateProfileService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async execute({
		user_id,
		name,
		email,
		old_password,
		password,
	}: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(user_id);

		if (!user) {
			throw new AppError('User not found');
		}

		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail && userWithSameEmail.id !== user.id) {
			throw new AppError('E-mail already in use');
		}

		Object.assign(user, { name, email });

		if (password) {
			if (!old_password) {
				throw new AppError(
					'You need to inform old_password to set new password',
				);
			}

			const checkPassword = await this.hashProvider.compareHash(
				old_password,
				user.password,
			);

			if (!checkPassword) {
				throw new AppError(
					'You need to inform correct old_password to set new password',
				);
			}

			user.password = await this.hashProvider.generateHash(password);
		}

		const updatedUser = await this.usersRepository.save(user);

		return updatedUser;
	}
}

export default UpdateProfileService;
