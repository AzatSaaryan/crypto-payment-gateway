import { Request } from 'express';
import { JwtPayload } from '../../jwt/types/jwt-payload.type';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface UserFromToken {
  userId: string;
  email: string;
}
