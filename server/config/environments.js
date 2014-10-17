var path = require('path'),
  rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    rootPath: rootPath,
    database: 'mongodb://localhost/votes',
    port: process.env.PORT || 3000
  },
  testing: {

  },
  production: {
    
  }
}