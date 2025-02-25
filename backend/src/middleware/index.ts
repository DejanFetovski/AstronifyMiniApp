
import jwt from 'jsonwebtoken'
import express from 'express'

export const verifyToken = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) : void => {
    const authHeader = req.headers['authorization']
  
    //Extracting token from authorization header
    const token = authHeader && authHeader.split(' ')[1]
  
    //Checking if the token is null
    if (!token) {
      const error = new Error('Authorization failed. No access token.')
      return next(error)
    }
  
    //Verifying if the token is valid.
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        console.log(err)
        const error = new Error('Could not verify token')
        return next(error)
      }
      req.body.user = user
      next()
    })
    
  }
  