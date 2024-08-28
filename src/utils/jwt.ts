import jwt from 'jsonwebtoken';
import { environment as env } from './config/environment';

export class JWT {
  public sign(payload: string | Buffer | object): string {
    return jwt.sign({data:payload}, env.appJwtSecret, {expiresIn: 60 * 60 * 24});
  }

  public verify(token: string): jwt.JwtPayload | string {
    return jwt.verify(token, env.appJwtSecret);
  }
}

export const tokenizer = new JWT()