import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err, payload) {
    if (err || !payload) {
      console.error(err)
      throw new UnauthorizedException("É necessário se autenticar");
    }

    return payload;
  }
}
