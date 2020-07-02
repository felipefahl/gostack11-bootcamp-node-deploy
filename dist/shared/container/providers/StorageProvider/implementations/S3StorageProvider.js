"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _mime = _interopRequireDefault(require("mime"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _upload = _interopRequireDefault(require("../../../../../config/upload"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class S3StorageProvider {
  constructor() {
    this.client = void 0;
    this.client = new _awsSdk.default.S3();
  }

  async saveFile(file) {
    const originalPath = _path.default.resolve(_upload.default.tempFolder, file);

    const contentType = _mime.default.getType(originalPath);

    if (!contentType) {
      throw new Error('File not found');
    }

    const fileContent = await _fs.default.promises.readFile(originalPath);
    await this.client.putObject({
      Bucket: _upload.default.config.aws.bucket,
      Key: file,
      ContentType: contentType,
      ACL: 'public-read',
      Body: fileContent,
      ContentDisposition: `inline; filename=${file}`
    }).promise();
    await _fs.default.promises.unlink(originalPath);
    return file;
  }

  async deleteFile(file) {
    await this.client.deleteObject({
      Bucket: _upload.default.config.aws.bucket,
      Key: file
    }).promise();
  }

}

exports.default = S3StorageProvider;