"use strict";

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _ShowProfileService = _interopRequireDefault(require("./ShowProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeRepository;
let showProfile;
describe('ShowProfile', () => {
  beforeEach(() => {
    fakeRepository = new _FakeUsersRepository.default();
    showProfile = new _ShowProfileService.default(fakeRepository);
  });
  it('should be able to show user profile', async () => {
    const user = await fakeRepository.create({
      name: 'Teste ts',
      email: 'email@email.com',
      password: 'HASdASDHJasAHSDdashewhrh'
    });
    const showUser = await showProfile.execute({
      user_id: user.id
    });
    expect(showUser.name).toEqual('Teste ts');
    expect(showUser.email).toEqual('email@email.com');
  });
  it('should not be able to change non-existing user', async () => {
    await expect(showProfile.execute({
      user_id: 'Non-Existing user_id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});