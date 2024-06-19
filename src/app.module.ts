import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './utils/response.interceptor';
import { ApiMiddleware } from './utils/api.middleware';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FazendasModule } from './fazendas/fazendas.module';

@Module({
  imports: [
    UsuariosModule, 
    AuthModule, 
    PrismaModule,
    FazendasModule,
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    /*LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
      },
    })*/
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(ApiMiddleware)
        .exclude(
          { path: '/', method: RequestMethod.GET }
        )
        .forRoutes('*');
    }
}
