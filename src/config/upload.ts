import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

interface IUploadConfig {
	driver: 'disk' | 's3';
	tempFolder: string;
	uploadsFolder: string;
	multer: { storage: multer.StorageEngine };
	config: {
		disk: object;
		aws: {
			bucket: string;
		};
	};
}

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
	driver: process.env.STORAGE_DRIVER,
	tempFolder,
	uploadsFolder: path.resolve(tempFolder, 'uploads'),
	multer: {
		storage: multer.diskStorage({
			destination: tempFolder,
			filename(request, file, callback) {
				const fileHash = crypto.randomBytes(10).toString('HEX');
				const fileName = `${fileHash}-${file.originalname}`;

				return callback(null, fileName);
			},
		}),
	},
	config: {
		disk: {},
		aws: {
			bucket: 'felipefahl-app-gobarber',
		},
	},
} as IUploadConfig;
