var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = {
  getAllUsers: function(params, callback) {
    User.find(params, function(err, users) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, users);
      return;
    });
  },

  createUser: function(params, callback) {
    const password = params.password;

    bcrypt.genSalt(10, function(err, salt) {

      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          callback(err, null);
          return;
        }
        params.password = hash;

        User.create(params, function(err, user) {
          if (err) {
            callback(err, null);
            return;
          }
          callback(null, user);
          return;
        });
      });
    });
  },

  loginUser: function(params, callback) {
    User.findOne({ name: params.name }, function(err, user) {
      if (err) {
        callback(err, null);
        return;
      }
      
      if (user === null) {
        let errorMessage = 404;
        callback(errorMessage, null);
        return;
      }

      bcrypt.compare(params.password, user.password, function(err, res) {
        // res === true
        if (err) {
          callback(err, null);
        }

        if (res === false) {
          callback(err, null);
        } else {
          callback(null, user);
        }
      });
    });
  },
  updateUserProfile: function(id, params, callback) {

    if (params.password) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(params.password, salt);
      params.password = hash;
    }

    User.findByIdAndUpdate(id, params, {new: true}, function(err, updated) {

      if (err) {
        callback(err, null);
        return;
      }

      callback(null, updated);
      return;
    });
  },
  deleteUser: function(params, callback) {

    User.findByIdAndRemove(params, function(err) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, 'Successfully Deleted');
      return;
    });

  }
};
