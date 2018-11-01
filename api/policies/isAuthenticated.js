/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to require an authenticated user, or else redirect to login page
 *                 Looks for an Authorization header bearing a valid JWT token
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
var jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {

  // Check for a JWT token in the header
  if (req.header('authorization')) {
    // If one exists, attempt to get the header data
    var token = req.header('authorization').split('Bearer ')[1];
    // If there's nothing after "Bearer", just redirect to login
    console.log("passing 1");
    if (!token) {return res.send(401);}
    console.log("passing 2");
    // If there is something, attempt to parse it as a JWT token
    // TODO:: @sahanarula remove quotes check here
    return jwt.verify(token.replace(/^"(.*)"$/, '$1'), sails.config.custom.jwtSecret, function(err, payload) {
      // If there's an error verifying the token (e.g. it's invalid or expired),
      // send to the login page.
      console.log("passing 3");
      if (err) {
        return res.send(401);
      }

      console.log("passing 4");
      // If there's no user ID in the token, send to login
      console.log("passing 5");
      if (!payload.user) {return res.send(401);}
      // Otherwise try to look up that user
      console.log("passing 6");
      User.findOne(payload.user, function(err, user) {
        if (err) {return res.negotiate(err);}
        // If the user can't be found, send to the login page
        if (!user) {return res.send(401);}
        // Otherwise save the user object on the request (i.e. "log in") and continue
        req.user = user;
        return next();
      });
    });
  }

  // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
  // send a 401 response letting the user agent know they need to login to
  // access this endpoint.
  console.log("passing 7");
  if (req.wantsJSON) {
    return res.send(401);
  }

  console.log("passing 8");
  // Otherwise if this is an HTML-wanting browser, do a send.
  return res.send(401);
};
