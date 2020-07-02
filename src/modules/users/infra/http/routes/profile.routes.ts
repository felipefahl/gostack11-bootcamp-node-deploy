import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);
profileRouter.put(
	'/',
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			old_password: Joi.string(),
			password: Joi.string().when('old_password', {
				then: Joi.string().required(),
			}),
			password_confirmation: Joi.string()
				.valid(Joi.ref('password'))
				.when('old_password', {
					then: Joi.string().required().valid(Joi.ref('password')),
				}),
		},
	}),
	profileController.update,
);
profileRouter.get('/', profileController.show);

export default profileRouter;
