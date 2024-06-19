import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    ConflictException,
    BadRequestException,
    ServiceUnavailableException,
    HttpException,
  } from '@nestjs/common';
  import {
    PrismaClientKnownRequestError,
    PrismaClientInitializationError,
    PrismaClientRustPanicError,
  } from '@prisma/client/runtime/library';
  
  @Catch(Error) // Captura todos os erros, mas focaremos nos erros do Prisma
  export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest<Request>();
  
      // Configuração padrão para erros inesperados
      let status = (exception instanceof HttpException) ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      let message = (exception instanceof HttpException) ? exception.getResponse() : 'Erro inesperado ocorreu';

      // Tratamento de erros do Prisma
      if (exception instanceof PrismaClientKnownRequestError) {
        switch (exception.code) {
          case 'P2002':
            status = HttpStatus.CONFLICT;
            message = 'Conflito de dados detectado.';
            break;
          case 'P2025':
            status = HttpStatus.NOT_FOUND;
            message = 'Registro não encontrado.';
            break;
          // Adicione tratamentos para outros códigos de erro do Prisma conforme necessário
        }
      } else if (exception instanceof PrismaClientInitializationError) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Falha ao inicializar o cliente do banco de dados.';
      } else if (exception instanceof PrismaClientRustPanicError) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Erro interno do cliente do banco de dados.';
      } else if (exception.message.includes('Transaction failed')) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Falha na transação do banco de dados.';
      } else if (exception instanceof BadRequestException) {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
      }

      // Assegura que a mensagem seja uma string, caso a exceção traga um objeto como resposta
      if (typeof message !== 'string') {
        message = message['message'] || JSON.stringify(message);
      }
  
      response.status(status).json({
        message: message,
        statusCode: status,
        data: null
      });
    }
  }
  