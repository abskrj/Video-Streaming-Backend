const authJwt = require("./authJwt");
const verifyRegister = require("./verifyRegister");
const videoMiddlewares = require('./videoConf');


module.exports = {
  authJwt,
  verifyRegister,
  videoMiddlewares
};