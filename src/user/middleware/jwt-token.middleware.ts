import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      req['user'] = decoded;
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.status(440).json({
          message: '세션이 만료되었습니다. 다시 로그인해주세요.',
          error: 'Token Expired',
          isTokenExpired: true,
        });

        return;
      }

      throw new UnauthorizedException('Invalid token: ' + error);
    }
  }
}
