"use strict";

var _FakeUsersRepository = _interopRequireDefault(require("../../users/repositories/fakes/FakeUsersRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _ListProvidersServices = _interopRequireDefault(require("./ListProvidersServices"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeRepository;
let fakeCacheProvider;
let listProvider;
describe('ListProviders', () => {
  beforeEach(() => {
    fakeRepository = new _FakeUsersRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    listProvider = new _ListProvidersServices.default(fakeRepository, fakeCacheProvider);
  });
  it('should be able to list providers', async () => {
    const provider1 = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    const provider2 = await fakeRepository.create({
      name: 'Teste ts2',
      email: 'email2@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    const user = await fakeRepository.create({
      name: 'Teste ts3',
      email: 'email3@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    const providers = await listProvider.execute({
      user_id: user.id
    });
    expect(providers).toEqual([provider1, provider2]);
  });
});