var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var userMiddleware = require('../utils/usersMiddleware');

/* GET users listing. */
router.get('/createuser', function(req, res, next) {
  console.log(req.session.user)
  res.render('register', { title: 'Sign up', error: '' });
});

router.get('/edituser', userMiddleware.findAuthUser, function(req, res, next) {
  
});

router.post('/createuser', function(req, res, next) {

  userController.createUser(req.body, function(err, user) {
    if (err) {
      let errMessage;

      if (err.code === 11000) {
        errMessage = 'Name already exist choose another one';
        res.render('register', {error: errMessage});
        return;
      }
      res.render('result', {
        message: 'Failure to create new User, try again.',
        error: err
      });
      return;
    }

    req.session.userID = user._id;
    req.session.user = user;

    res.render('index', {
      message: 'Hello ' + user.name + ", you've successfully logged in",
      currentUser: user
    });
    return;
  });
});

router.post('/login', function(req, res, next) {

  userController.loginUser(req.body, function(err, user) {
    if (err) {

      if (err === 404) {
        // res.json({
        //   message: 'failure',
        //   alert: 'User does not exist'
        // });
        let errMessage = 'User does not exist';
        res.render('login', {error: errMessage});
        return;
      }

      res.status(404).json({
        message: 'Fail',
        error: err
      });
      return;
    }

    if (user === null) {
      res.render('result', {
        message: 'Failure to login, Please check your username and password',
        error: 'Check your username and password'
      });
      return;
    }

    req.session.userID = user._id;

    res.render('index', {
      message: 'Hello ' + user.name + ", you've successfully logged in",
      currentUser: user
    });
    return;
  });
});

router.get('/login', function(req, res) {
  res.render('login', {error: ''});
});

router.get('/signout', function(req, res, next) {
  req.session = null;
  res.render('index', {currentUser: '', message: ''})
});

router.put('/update-profile', function(req, res, next) {
  let userID = req.session.userID
  let newProfile = req.body;

  if (req.body.password.length < 6) {
    let error = 'password needs to have 6 characters'
    res.render('editpage', {error: error, currentUser: req.session.user});
    return;
  }
  
  userController.updateUserProfile(userID, newProfile, function(err, updated) {
    if (err) {
      
      if (err === 404) {
        res.json({
          message: 'failure',
          alert: 'User does not exist'
        });
      }
      res.json({
        message: 'failure',
        data: err
      });
      return;
    }
    // res.json({
    //   message: 'success',
    //   data: updated
    // });
    console.log(updated)
    res.render('editpage', {error: '', currentUser: updated})
    return;
  });

});

router.get('/delete-user', function(req, res) {
  res.render('delete');
});

router.delete('/delete-user', function(req, res) {

  userController.deleteUser( req.session.userID, function(err) {
    if (err) {
      res.json({
        message: 'Fail to delete user',
        data: err
      });
    }

    res.render('index', { title: 'Express', currentUser: '', message: '' });
  })

});

module.exports = router;
