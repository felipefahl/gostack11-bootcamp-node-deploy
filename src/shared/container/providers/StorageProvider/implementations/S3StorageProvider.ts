import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadconfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
	private client: S3;

	constructor() {
		this.client = new aws.S3();
	}

	public async saveFile(file: string): Promise<string> {
		const originalPath = path.resolve(uploadconfig.tempFolder, file);

		const contentType = mime.getType(originalPath);

		if (!contentType) {
			throw new Error('File not found');
		}

		const fileContent = await fs.promises.readFile(originalPath);

		await this.client
			.putObject({
				Bucket: uploadconfig.config.aws.bucket,
				Key: file,
				ContentType: contentType,
				ACL: 'public-read',
				Body: fileContent,
				ContentDisposition: `inline; filename=${file}`,
			})
			.promise();
		await fs.promises.unlink(originalPath);
		return file;
	}

	public async deleteFile(file: string): Promise<void> {
		await this.client
			.deleteObject({
				Bucket: uploadconfig.config.aws.bucket,
				Key: file,
			})
			.promise();
	}
}
