const firebase = require("firebase");
const config = require("../util/config");
const { validateLoginData } = require("../util/validators");

firebase.initializeApp(config);

exports.loginUser = (req, resp) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return resp.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => data.user.getIdToken())
    .then(token => resp.json({ token }))
    .catch(error => {
      console.error(error);
      return resp.status(403).json({ general: 'Wrong combination of user and password!' })
    })
};
