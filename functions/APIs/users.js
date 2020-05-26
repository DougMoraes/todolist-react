const firebase = require("firebase");
const { db } = require("../util/admin");
const config = require("../util/config");
const { validateLoginData, validateSignUpData } = require("../util/validators");

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
      return resp
        .status(403)
        .json({ general: "Wrong combination of user and password!" });
    });
};

exports.signUpUser = (req, resp) => {
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    country: req.body.country,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return resp.status(400).json(errors);

  let token, userId;

  db.doc(`/users/${newUser.username}`)
    .get()
    .then(doc =>
      doc.exists
        ? response
            .status(400)
            .json({ username: "this username is already taken" })
        : firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
    )
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;

      const userInfo = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        phoneNumber: newUser.phoneNumber,
        country: newUser.country,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };

      return db.doc(`/users/${newUser.username}`).set(userInfo);
    })
    .then(() => response.status(201).json({ token }))
    .catch(err => {
      console.log(err);
      err.code === "auth/email-already-in-use"
        ? response.status(400).json({ email: "Email already in use" })
        : response
            .status(500)
            .json({ general: "Something went wrong, please try again" });
    });
};

exports.getUserDetails = (req, resp) => {
  let userData = {};

  db.doc(`/users/${req.user.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.userCredentials = doc.data();
        return resp.json(userData);
      }
    })
    .catch(err => {
      console.log(error);
      return resp.status(500).json({ error: err.code })
    });
};
