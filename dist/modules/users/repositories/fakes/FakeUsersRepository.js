"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../../infra/typeorm/entities/User"));

var _uuidv = require("uuidv4");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FakeUsersRepository {
  constructor() {
    this.users = [];
  }

  async findAllProviders({
    except_id
  }) {
    let {
      users
    } = this;

    if (except_id) {
      users = this.users.filter(user => user.id !== except_id);
    }

    return users;
  }

  async findById(id) {
    const findUser = this.users.find(user => user.id === id);
    return findUser;
  }

  async findByEmail(email) {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }

  async create({
    name,
    email,
    password
  }) {
    const user = new _User.default();
    Object.assign(user, {
      id: (0, _uuidv.uuid)(),
      name,
      email,
      password
    });
    this.users.push(user);
    return user;
  }

  async save(user) {
    const findIndex = this.users.findIndex(searchUser => searchUser.id === user.id);
    this.users[findIndex] = user;
    return user;
  }

}

var _default = FakeUsersRepository;
exports.default = _default;