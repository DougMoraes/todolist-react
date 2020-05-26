const { admin, db } = require('./admin')

module.exports = (req, resp, next) => {
  let idToken;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return resp.status(403).json({ error: 'Unauthorized' });
  }

  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return db.collection('users').where('userId', '==', req.user.uid).limit(1).get();
    })
    .then(data => {
      req.user.username = data.docs[0].data().username;
      req.user.imageUrl = data.docs[0].data().imageURL;
      return next()
    })
    .catch(err => {
      console.error('Error while verifying token', err)
      return resp.status(403).json(err);
    })
}