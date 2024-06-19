import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (request.method === 'GET') {
      if (user && user.id) {
        request.query.idUsuario = user.id;
      }

      if (request.query.id_imovel) {
        request.query.id_imovel = parseInt(request.query.id_imovel);
      }

    } else if (user && user.id) {
      request.body.idUsuario = user.id;
    }

    return next.handle();
  }
}
