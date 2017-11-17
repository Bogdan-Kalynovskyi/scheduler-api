import jwt from 'jwt-simple'

export let createToken = function (req, res, next) {
  req.expires = Date.now() + 999000;
  req.token = jwt.encode({
    exp: req.expires
  }, 'secret')
  next()
}

export let jwtAuth = function (req, res, next) {
  let token = req.headers['x-access-token'];
  if (token) {
    try {
      let decoded = jwt.decode(token, 'secret')
      if (decoded.exp < Date.now()) res.sendStatus(498)
      else
        next()
    } catch (err) {
      return res.json({
        message: 'token is invalid'
      })
    }
  } else
    res.json({
      message: 'there is no token'
    })
}
