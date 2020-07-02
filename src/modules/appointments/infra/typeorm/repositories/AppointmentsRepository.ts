import { getRepository, Repository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateApointmentDTO from '@modules/appointments/dtos/ICreateApointmentDTO';
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthProviderDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
	private ormRepository: Repository<Appointment>;

	constructor() {
		this.ormRepository = getRepository(Appointment);
	}

	public async findAllInMonthFromProvider({
		provider_id,
		month,
		year,
	}: IFindAllInMonthProviderDTO): Promise<Appointment[]> {
		const parsedMonth = String(month).padStart(2, '0');
		const appointments = await this.ormRepository.find({
			where: {
				provider_id,
				date: Raw(
					dateFieldName =>
						`to_Char(${dateFieldName},'MM-YYYY') = '${parsedMonth}-${year}'`,
				),
			},
		});
		return appointments;
	}

	public async findAllInDayFromProvider({
		provider_id,
		month,
		year,
		day,
	}: IFindAllInDayProviderDTO): Promise<Appointment[]> {
		const parsedDay = String(day).padStart(2, '0');
		const parsedMonth = String(month).padStart(2, '0');
		const appointments = await this.ormRepository.find({
			where: {
				provider_id,
				date: Raw(
					dateFieldName =>
						`to_Char(${dateFieldName},'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
				),
			},
			relations: ['user'],
		});
		return appointments;
	}

	public async findByDate(
		date: Date,
		provider_id: string,
	): Promise<Appointment | undefined> {
		const findAppointment = await this.ormRepository.findOne({
			where: { date, provider_id },
		});
		return findAppointment;
	}

	public async create({
		provider_id,
		user_id,
		date,
	}: ICreateApointmentDTO): Promise<Appointment> {
		const appointment = this.ormRepository.create({
			provider_id,
			user_id,
			date,
		});
		await this.ormRepository.save(appointment);
		return appointment;
	}
}

export default AppointmentsRepository;
