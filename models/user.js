const validator = require('validator');

const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Вениамин',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
})

module.exports = model('user', userSchema);
