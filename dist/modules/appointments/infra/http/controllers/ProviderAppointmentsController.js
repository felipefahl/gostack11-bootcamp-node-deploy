"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ListProviderAppointmentsService = _interopRequireDefault(require("../../../services/ListProviderAppointmentsService"));

var _classTransformer = require("class-transformer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProviderAppointmentsController {
  async index(request, response) {
    const provider_id = request.user.id;
    const {
      year,
      month,
      day
    } = request.query;

    const listProviderAppointments = _tsyringe.container.resolve(_ListProviderAppointmentsService.default);

    const appointments = await listProviderAppointments.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
      day: Number(day)
    });
    return response.json((0, _classTransformer.classToClass)(appointments));
  }

}

exports.default = ProviderAppointmentsController;