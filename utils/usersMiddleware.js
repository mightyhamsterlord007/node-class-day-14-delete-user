var User = require('../models/user');

module.exports = {
    checkIfUserAlreadyExists: function(req, res, next) {
        
        const name = req.body.name;

        User.findOne({name: name}, function(err, result) {
            if (err) {
                res.status(500)
                   .json({
                        message: 'Fail',
                        data: err 
                   });
                return;
            }

            if (result === null) {
                next();
            } else {
                res.status(400)
                   .json({
                       message: 'Fail, user already exist',
                       data: result
                   });
                   return;
            }
        });
    },
    findAuthUser: function(req, res, next) {

        User.findById(req.session.userID, function(err, user) {
            if (err) {
                res.json({
                    message: 'Error',
                    data: err
                });
                return;
            }
            res.render('editpage', {currentUser: user, error: ''});
        });

    }
}