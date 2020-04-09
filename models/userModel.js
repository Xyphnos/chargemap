'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,
    full_name: String,
});

module.exports = mongoose.model('User', userSchema);

/*
const getUser = (id) => {
  const user = users.filter((usr) => {
    if (usr.id === id) {
      delete usr.password;
      return usr;
    }
  });
  return user[0];
};

const getUserLogin = (email) => {
  const user = users.filter((usr) => {
    if (usr.email === email) {
      return usr;
    }
  });
  return user[0];
};

module.exports = {
  users,
  getUser,
  getUserLogin,
};
 */
