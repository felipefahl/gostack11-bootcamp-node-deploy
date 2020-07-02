"use strict";

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _AuthenticateUserService = _interopRequireDefault(require("./AuthenticateUserService"));

var _CreateUserService = _interopRequireDefault(require("./CreateUserService"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeRepository;
let fakeHashProvider;
let fakeCacheProvider;
let createUser;
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createUser = new _CreateUserService.default(fakeRepository, fakeHashProvider, fakeCacheProvider);
  });
  it('should be able to authenticate', async () => {
    const authUser = new _AuthenticateUserService.default(fakeRepository, fakeHashProvider);
    const user = await createUser.execute({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    const response = await authUser.execute({
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should not be able to authenticate with non exitent user', async () => {
    const authUser = new _AuthenticateUserService.default(fakeRepository, fakeHashProvider);
    await expect(authUser.execute({
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to authenticate with wrong password', async () => {
    const authUser = new _AuthenticateUserService.default(fakeRepository, fakeHashProvider);
    await createUser.execute({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    await expect(authUser.execute({
      email: 'email@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});