"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'felipefahl@felipefahl.dev',
      name: 'Felipe Fahl - Dev'
    }
  }
};
exports.default = _default;