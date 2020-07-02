"use strict";

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _ListProviderDayAvailabilityService = _interopRequireDefault(require("./ListProviderDayAvailabilityService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentsRepository;
let listProviderDayAvailability;
describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    listProviderDayAvailability = new _ListProviderDayAvailabilityService.default(fakeAppointmentsRepository);
  });
  it('should be able to list month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 12, 0, 0)
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 15, 0, 0)
    });
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date(2020, 4, 20, 11).getTime();
      return customDate;
    });
    const availability = await listProviderDayAvailability.execute({
      provider_id: 'provider_id',
      year: 2020,
      month: 5,
      day: 20
    });
    expect(availability).toEqual(expect.arrayContaining([{
      hour: 8,
      available: false
    }, {
      hour: 9,
      available: false
    }, {
      hour: 10,
      available: false
    }, {
      hour: 11,
      available: false
    }, {
      hour: 12,
      available: false
    }, {
      hour: 13,
      available: true
    }, {
      hour: 14,
      available: true
    }, {
      hour: 15,
      available: false
    }]));
  });
});