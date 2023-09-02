import * as admin from 'firebase-admin';
import User from '../models/user.model';

export default (options) => {
  return async (req, res, next) => {
    try {
      const decodedToken = await admin
        .auth()
        .verifyIdToken(req.header('Authorization').replace('Bearer ', ''));
      const user = await User.findOne({ uid: decodedToken.uid });

      if (!user) {
        return res.status(401).send({ error: 'Access Denied!' });
      }

      req.user = user;

      if (!options) return next();

      if (!options.roles.includes(req?.user?.role)) {
        return res.status(401).send({ error: 'Access Denied!' });
      }
      next();
    } catch (error) {
      return res.status(401).send({ error: 'Access Denied!' });
    }
  };
};
