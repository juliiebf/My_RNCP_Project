import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

interface JWTPayload {
  id: number;
  email: string;
  username: string;
}

interface AuthResult {
  valid: boolean;
  user?: JWTPayload;
  error?: string;
}

export const authenticateToken = (req: NextRequest): AuthResult => {
  const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  console.log('🔍 AUTH TOKEN:', token ? 'OK' : 'NULL');
  
  if (!token) {
    return { valid: false, error: 'No token provided' };
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return { valid: true, user: decoded };
  } catch (error) {
    console.error('🔍 JWT ERROR:', error);
    return { valid: false, error: 'Invalid token' };
  }
};
