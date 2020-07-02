"use strict";

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeNotificationRepository = _interopRequireDefault(require("../../notifications/repositories/fakes/FakeNotificationRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _CreateAppointmentService = _interopRequireDefault(require("./CreateAppointmentService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeRepository;
let fakeNotificationRepository;
let fakeCacheProvider;
let createAppointment;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeRepository = new _FakeAppointmentsRepository.default();
    fakeNotificationRepository = new _FakeNotificationRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createAppointment = new _CreateAppointmentService.default(fakeRepository, fakeNotificationRepository, fakeCacheProvider);
  });
  it('should be able to create a new appointment', async () => {
    const date = new Date(2020, 4, 10, 16);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date(2020, 4, 10, 10).getTime();
      return customDate;
    });
    const appointment = await createAppointment.execute({
      date,
      user_id: '58585858',
      provider_id: '4654654654'
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('4654654654');
  });
  it('should not be able to create two appointments on the same schedule', async () => {
    const date = new Date(2020, 4, 10, 16);
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date(2020, 4, 10, 10).getTime();
      return customDate;
    });
    await createAppointment.execute({
      date,
      user_id: '58585858',
      provider_id: '4654654654'
    });
    await expect(createAppointment.execute({
      date,
      user_id: '58585858',
      provider_id: '4654654654'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment on a past date', async () => {
    const date = new Date(2020, 4, 10, 16);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date(2020, 4, 11, 10).getTime();
      return customDate;
    });
    await expect(createAppointment.execute({
      date,
      user_id: '58585858',
      provider_id: '4654654654'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment with same user and provider', async () => {
    const date = new Date(2020, 4, 10, 16);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date(2020, 4, 10, 10).getTime();
      return customDate;
    });
    await expect(createAppointment.execute({
      date,
      user_id: '58585858',
      provider_id: '58585858'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment before 8AM or after 5PM', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date(2020, 4, 10, 10).getTime();
      return customDate;
    });
    await expect(createAppointment.execute({
      date: new Date(2020, 4, 11, 7),
      user_id: '58585858',
      provider_id: '4654654654'
    })).rejects.toBeInstanceOf(_AppError.default);
    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 18),
      user_id: '58585858',
      provider_id: '4654654654'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});