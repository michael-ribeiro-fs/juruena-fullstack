'use strict';

async function getMe(req, res) {
  const {
    _id, name, email, role,
  } = req.user;

  res.status(200).json({
    _id,
    name,
    email,
    role,
  });
}

module.exports = { getMe };
