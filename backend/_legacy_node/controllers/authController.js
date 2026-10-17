import express from 'express'


// middleware for if user is authenticated. 


// Guard: only proceed if a session userId exists
export const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  // optional: expose to downstream handlers
  req.userId = req.session.userId;
  req.userRole = req.session.role;
  next();
};
