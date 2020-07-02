import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
describe('ListProviderMonthAvailability', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
			fakeAppointmentsRepository,
		);
	});

	it('should be able to list month availability from provider', async () => {
		const hourStart = 8;

		const promises = Array.from({ length: 10 }, (_, index) => {
			const hour = index + hourStart;
			return fakeAppointmentsRepository.create({
				provider_id: 'provider_id',
				user_id: 'user_id',
				date: new Date(2020, 4, 20, hour, 0, 0),
			});
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'provider_id',
			user_id: 'user_id',
			date: new Date(2020, 4, 21, 8, 0, 0),
		});

		await Promise.all(promises);

		jest.spyOn(Date, 'now').mockImplementation(() => {
			const customDate = new Date(2020, 4, 18).getTime();
			return customDate;
		});

		const availability = await listProviderMonthAvailability.execute({
			provider_id: 'provider_id',
			year: 2020,
			month: 5,
		});

		expect(availability).toEqual(
			expect.arrayContaining([
				{ day: 19, available: true },
				{ day: 20, available: false },
				{ day: 21, available: true },
				{ day: 22, available: true },
			]),
		);
	});
});
