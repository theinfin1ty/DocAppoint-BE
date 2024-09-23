import User from '../models/user.model';
import { verifyToken } from '../utils/auth.util';

export default (options) => {
  return async (req, res, next) => {
    try {
      const decodedToken: any = verifyToken(req.header('Authorization').replace('Bearer ', ''));
      const user = await User.findOne({ _id: decodedToken._id });

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
