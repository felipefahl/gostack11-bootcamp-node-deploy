"use strict";

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _CreateUserService = _interopRequireDefault(require("./CreateUserService"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeRepository;
let fakeHashProvider;
let fakeCacheProvider;
let createUser;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createUser = new _CreateUserService.default(fakeRepository, fakeHashProvider, fakeCacheProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('email@email.com');
  });
  it('should not be able to create a new user with same email', async () => {
    await createUser.execute({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    await expect(createUser.execute({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});