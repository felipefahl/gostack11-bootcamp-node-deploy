import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateApointmentDTO from '@modules/appointments/dtos/ICreateApointmentDTO';
import IFindAllInMonthProviderDTO from '../dtos/IFindAllInMonthProviderDTO';
import IFindAllInDayProviderDTO from '../dtos/IFindAllInDayProviderDTO';

export default interface IAppointmentsRepository {
	create(data: ICreateApointmentDTO): Promise<Appointment>;
	findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
	findAllInMonthFromProvider(
		data: IFindAllInMonthProviderDTO,
	): Promise<Appointment[]>;
	findAllInDayFromProvider(
		data: IFindAllInDayProviderDTO,
	): Promise<Appointment[]>;
}
