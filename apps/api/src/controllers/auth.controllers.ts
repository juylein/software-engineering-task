import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import { createUser } from "../models/User"
import bcrypt from "bcryptjs"

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser: PlatformUser = {
      id: null,
      email,
      password: hashedPassword
    };

    const createdUser = await createUser(newUser.email, newUser.password);
    res.status(201).json({message: 'User registered successfully', user: createdUser});
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      res.status(409).json({error: 'Email already in use'});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
};