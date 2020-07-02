"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ListProviderDayAvailabilityService = _interopRequireDefault(require("../../../services/ListProviderDayAvailabilityService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProviderDayAvailabilityController {
  async index(request, response) {
    const {
      provider_id
    } = request.params;
    const {
      year,
      month,
      day
    } = request.query;

    const listProviderDayAvailability = _tsyringe.container.resolve(_ListProviderDayAvailabilityService.default);

    const appointment = await listProviderDayAvailability.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
      day: Number(day)
    });
    return response.json(appointment);
  }

}

exports.default = ProviderDayAvailabilityController;