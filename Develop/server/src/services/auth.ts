import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

const secretKey = process.env.JWT_SECRET_KEY || '';

// Middleware function to authenticate token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];



    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user as JwtPayload;
      return next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Auth middleware function for GraphQL
export const authMiddleware = async ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    return jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        throw new Error('Forbidden'); // Forbidden
      }

      return user as JwtPayload;
  });
  } else {
    throw new Error('Unauthorized'); // Unauthorized
  }
};

// Function to sign token
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
