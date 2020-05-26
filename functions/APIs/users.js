const firebase = require("firebase");
const { admin, db } = require("../util/admin");
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
    .catch(err => {
      console.error(err);
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
      }

      return db.doc(`/users/${newUser.username}`).set(userInfo);
    })
    .then(() => response.status(201).json({ token }))
    .catch(err => {
      console.error(err);
      err.code === "auth/email-already-in-use" ?
        response.status(400).json({ email: 'Email already in use' }) :
        response.status(500).json({ general: 'Something went wrong, please try again' })
    })
};

deleteImage = imageName => {
  const bucket = admin.storage().bucket();
  const path = `${imageName}`;

  return bucket.file(path).delete().then(() => { }).catch(err => { }) //if this doenst work search for it you deleted a part that seems useles
}

exports.uploadProfilePhoto = (req, resp) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      return resp.status(400).json({ error: 'Wrong file type submited' });
    }

    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${req.user.username}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });

  deleteImage(imageFileName);

  busboy.on('finish', () => {
    admin.storage().bucket().upload(imageToBeUploaded.filePath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

        return db.doc(`/users/${req.user.username}`).update({
          imageUrl
        });
      })
      .then(() => {
        return resp.json({ message: 'Image uploaded successfully' });
      })
      .catch(err => {
        console.error(err);
        return resp.status(500).json({ error: err.code })
      })
  });

  busboy.end(req.rawBody);
}