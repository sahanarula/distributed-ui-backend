var bcrypt = require('bcrypt'),
  saltRounds = 10;

module.exports = {


  friendlyName: 'Password hash',


  description: '',


  inputs: {
    password: {
      type: 'string',
      example: 'hello',
      description: 'The password of the user to encrypt',
      required: true
    }
  },

  fn: async function (inputs, exits) {
    const cryptedPass = await bcrypt.hash(inputs.password, saltRounds);
    return exits.success(cryptedPass);
  }


};

