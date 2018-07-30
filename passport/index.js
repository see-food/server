const passport = require('passport');
const cors = require('cors')

require('./serializers');
require('./localStrategy');

module.exports = (app)  => {
  app.use(passport.initialize());
  app.use(passport.session());

  var whitelist = [
    'http://localhost:4200'
  ];
  var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
  };
  app.use(cors(corsOptions));
}
