const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get the token from the 'Authorization' header
  const authHeader = req.header('Authorization');
  
  // Check if the header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  // Extract the token
  const token = req.header('Authorization')?.split(' ')[1]; // Remove 'Bearer '

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the verified user data to the request object
    req.user = verified;

    // Proceed to the next middleware/controller
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};
