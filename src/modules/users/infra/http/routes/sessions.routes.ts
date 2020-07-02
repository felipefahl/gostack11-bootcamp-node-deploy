import { Router } from 'express';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';
import { Segments, celebrate, Joi } from 'celebrate';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			password: Joi.string().required(),
			email: Joi.string().email().required(),
		},
	}),
	sessionsController.create,
);

export default sessionsRouter;
