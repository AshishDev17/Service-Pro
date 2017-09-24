const router = require('express').Router();
const User = require('../../db/models/user');
module.exports = router;

// /auth/login
router.post('/login', (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        res.status(401).send('User not found');
      } else if (!user.correctPassword(req.body.password)) {
        res.status(401).send('Incorrect password');
      } else {
        return user;
      }
    })
    .then(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      icon: user.icon,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
    }))
    .then((user) => {
      req.login(user, (err) => (err ? next(err) : res.json(user)));
    })
    .catch(next);
});

// /auth/signup
router.post('/signup', (req, res, next) => {
  console.log('req body', req.body);
  User.create(req.body)
    .then(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      icon: user.icon,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
    }))
    .then((user) => {
      req.login(user, (err) => (err ? next(err) : res.json(user)));
    })
    .catch((err) => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(401).send('User already exists');
      } else {
        next(err);
      }
    });
});

// /auth/logout
router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/me', (req, res) => {
  res.json(req.user);
});

//router.use('/google', require('./google'));
