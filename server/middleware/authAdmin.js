// server/middleware/authAdmin.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authAdmin = async function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = auth.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized - Admin access required' });
    }
    
    req.admin = user;
    req.userId = user._id;
    next();
  } catch (err) {
    console.error('❌ Auth Admin Error:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authAdmin;