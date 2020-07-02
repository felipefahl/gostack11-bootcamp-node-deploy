interface IMailConfig {
	driver: 'ethereal' | 'ses';
	defaults: {
		from: {
			email: string;
			name: string;
		};
	};
}
export default {
	driver: process.env.MAIL_DRIVER || 'ethereal',

	defaults: {
		from: {
			email: 'felipefahl@felipefahl.dev',
			name: 'Felipe Fahl - Dev',
		},
	},
} as IMailConfig;
