const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.query, req.body, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Extract token from Authorization header if present
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // Check if token exists
    if (!token) {
      throw new Error('You have no token!');
    }

    try {
      // verify token and get user data out of it
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      
      // Return user data in the context
      return { user: data };
    } catch {
      console.log('Invalid token');
      // Throw an error if token is invalid
      throw new Error('Invalid token!');
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    // Sign token with payload and secret key
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
