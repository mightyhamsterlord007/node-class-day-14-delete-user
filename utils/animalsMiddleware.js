var Animal = require('../models/animal');

module.exports = {
    makeSound: function(req, res, next) {
        console.log('HELLO CLASSSSSS');
        next();
    },
    checkIfAnimalNameExists: function(req, res, next) {
        
        const name = req.body.name;

        Animal.findOne({name: name}, function(err, result) {

            if (err) {
                res.status(500).json({
                    message: 'Fail',
                    data: err
                });
                return;
            }

            if (result === null) {
                next();
            } else {
                // console.log(result)
                // res.json({
                //     message: 'User already exists',
                //     data: result
                // });
                res.render('animal', {error: 'User already exists'});
            }
        });

    }
}