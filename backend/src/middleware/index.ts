
import jwt from 'jsonwebtoken'
import express from 'express'

export const verifyToken = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const authHeader = req.headers['authorization']
  
    //Extracting token from authorization header
    const token = authHeader && authHeader.split(' ')[1]
  
    //Checking if the token is null
    if (!token) {
      return res.status(401).send('Authorization failed. No access token.')
    }
  
    console.log("TOKEN: ", token, authHeader)
    //Verifying if the token is valid.
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        console.log(err)
        return res.status(403).send('Could not verify token')
      }
      req.body.user = user
    })
    next()
  }
  