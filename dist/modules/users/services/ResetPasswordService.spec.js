"use strict";

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUserTokensRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserTokensRepository"));

var _ResetPasswordService = _interopRequireDefault(require("./ResetPasswordService"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeRepository;
let fakeUserTokensRepository;
let fakeHashProvider;
let resetePassword;
describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeRepository = new _FakeUsersRepository.default();
    fakeUserTokensRepository = new _FakeUserTokensRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    resetePassword = new _ResetPasswordService.default(fakeRepository, fakeUserTokensRepository, fakeHashProvider);
  });
  it('should be able to reset password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    const user = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    const userToken = await fakeUserTokensRepository.generate(user.id);
    await resetePassword.execute({
      token: userToken.token,
      password: 'mudou123'
    });
    const updatedUser = await fakeRepository.findById(user.id);
    expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password).toBe('mudou123');
    expect(generateHash).toBeCalledWith('mudou123');
  });
  it('should be not able to reset password if token does not exists', async () => {
    await expect(resetePassword.execute({
      token: 'non-existing-token',
      password: 'mudou123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be not able to reset password if the user does not exists', async () => {
    const userToken = await fakeUserTokensRepository.generate('non-existing-user');
    await expect(resetePassword.execute({
      token: userToken.token,
      password: 'mudou123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset password if past 2 hours', async () => {
    const user = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    const userToken = await fakeUserTokensRepository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });
    await expect(resetePassword.execute({
      token: userToken.token,
      password: 'mudou123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});