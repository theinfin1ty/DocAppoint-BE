import User from '../models/user.model';
import { verifyToken } from '../utils/auth.util';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send({ error: 'Access Denied!' });
    }
    
    const decodedToken: any = verifyToken(authHeader.replace('Bearer ', ''));
    const user = await User.findOne({ _id: decodedToken._id });

    if (!user) {
      return res.status(401).send({ error: 'Access Denied!' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ error: 'Access Denied!' });
  }
};

export const roleMiddleware = (roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req?.user?.role)) {
      return res.status(403).send({ error: 'Access Denied!' });
    }
    next();
  };
};

export default (options) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      if (!authHeader) {
        return res.status(401).send({ error: 'Access Denied!' });
      }
      
      const decodedToken: any = verifyToken(authHeader.replace('Bearer ', ''));
      const user = await User.findOne({ _id: decodedToken._id });

      if (!user) {
        return res.status(401).send({ error: 'Access Denied!' });
      }

      req.user = user;

      if (!options) return next();

      if (!options.roles.includes(req?.user?.role)) {
        return res.status(403).send({ error: 'Access Denied!' });
      }
      next();
    } catch (error) {
      return res.status(401).send({ error: 'Access Denied!' });
    }
  };
};
