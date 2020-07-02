"use strict";

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeStorageProvider = _interopRequireDefault(require("../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _UpdateUserAvatarService = _interopRequireDefault(require("./UpdateUserAvatarService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeRepository;
let fakeStorage;
let updateUserAvatar;
describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeRepository = new _FakeUsersRepository.default();
    fakeStorage = new _FakeStorageProvider.default();
    updateUserAvatar = new _UpdateUserAvatarService.default(fakeRepository, fakeStorage);
  });
  it('should be able to update user avatar', async () => {
    const user = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg'
    });
    expect(user.avatar).toEqual('avatar.jpg');
  });
  it('should be able to update user avatar that already have an avatar - deleting the old one', async () => {
    const deleteFile = jest.spyOn(fakeStorage, 'deleteFile');
    const user = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg'
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg'
    });
    expect(user.avatar).toEqual('avatar2.jpg');
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
  });
  it('should not be able to update user avatar with inexisting id', async () => {
    await expect(updateUserAvatar.execute({
      user_id: 'non-existing-user',
      avatarFileName: 'avatar.jpg'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});