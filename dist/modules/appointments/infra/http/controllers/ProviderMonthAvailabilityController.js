"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ListProviderMonthAvailabilityService = _interopRequireDefault(require("../../../services/ListProviderMonthAvailabilityService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProviderMonthAvailabilityController {
  async index(request, response) {
    const {
      provider_id
    } = request.params;
    const {
      year,
      month
    } = request.query;

    const listProviderMonthAvailability = _tsyringe.container.resolve(_ListProviderMonthAvailabilityService.default);

    const appointment = await listProviderMonthAvailability.execute({
      provider_id,
      year: Number(year),
      month: Number(month)
    });
    return response.json(appointment);
  }

}

exports.default = ProviderMonthAvailabilityController;