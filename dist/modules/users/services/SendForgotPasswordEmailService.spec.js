"use strict";

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeMailProvider = _interopRequireDefault(require("../../../shared/container/providers/MailProvider/fakes/FakeMailProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _SendForgotPasswordEmailService = _interopRequireDefault(require("./SendForgotPasswordEmailService"));

var _FakeUserTokensRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserTokensRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeRepository;
let fakeMailProvider;
let fakeUserTokenRepository;
let sendForgotPasswordEmail;
describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeRepository = new _FakeUsersRepository.default();
    fakeMailProvider = new _FakeMailProvider.default();
    fakeUserTokenRepository = new _FakeUserTokensRepository.default();
    sendForgotPasswordEmail = new _SendForgotPasswordEmailService.default(fakeRepository, fakeUserTokenRepository, fakeMailProvider);
  });
  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    await sendForgotPasswordEmail.execute({
      email: 'email@email.com'
    });
    expect(sendMail).toHaveBeenCalled();
  });
  it('should not be able to recover a non-existing user', async () => {
    await expect(sendForgotPasswordEmail.execute({
      email: 'email@email.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');
    const user = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    await sendForgotPasswordEmail.execute({
      email: 'email@email.com'
    });
    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});