import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authAdmin = async function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user || !user.isAdmin) return res.status(403).json({ message: 'Not authorized' });
    req.admin = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

export default authAdmin;