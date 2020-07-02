import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
	email: string;
	password: string;
}

interface IResponse {
	token: string;
	user: User;
}

@injectable()
class AuthenticateUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async execute({ email, password }: IRequest): Promise<IResponse> {
		const user = await this.usersRepository.findByEmail(email);
		if (!user) {
			throw new AppError('Email/Password dos not match', 401);
		}

		const passwordMatched = await this.hashProvider.compareHash(
			password,
			user.password,
		);
		if (!passwordMatched) {
			throw new AppError('Email/Password dos not match', 401);
		}

		const { secret, expiresIn } = authConfig.jwt;
		const token = sign({}, secret, {
			subject: user.id,
			expiresIn,
		});

		return { user, token };
	}
}

export default AuthenticateUserService;
