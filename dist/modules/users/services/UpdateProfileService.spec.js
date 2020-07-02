"use strict";

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _UpdateProfileService = _interopRequireDefault(require("./UpdateProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeRepository;
let fakeHash;
let updateProfile;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeRepository = new _FakeUsersRepository.default();
    fakeHash = new _FakeHashProvider.default();
    updateProfile = new _UpdateProfileService.default(fakeRepository, fakeHash);
  });
  it('should be able to update user profile', async () => {
    const user = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Teste ts surname',
      email: 'email@email.com'
    });
    expect(updatedUser.name).toEqual('Teste ts surname');
  });
  it('should not be able to change non-existing user', async () => {
    await expect(updateProfile.execute({
      user_id: 'Non-Existing user_id',
      name: 'Teste ts surname',
      email: 'email@email.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to change to another user email', async () => {
    await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    const user = await fakeRepository.create({
      name: 'Teste 2 ts',
      email: 'email.teste@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Teste ts surname',
      email: 'email@email.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to update user password', async () => {
    const user = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Teste ts surname',
      email: 'email@email.com',
      old_password: 'HASdASDHJasAHSDdashewhrh',
      password: '123456'
    });
    expect(updatedUser.password).toEqual('123456');
  });
  it('should not be able to update user password without old_password', async () => {
    const user = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Teste ts surname',
      email: 'email@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to update user password with wrong old_password', async () => {
    const user = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Teste ts surname',
      email: 'email@email.com',
      old_password: '123456',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});