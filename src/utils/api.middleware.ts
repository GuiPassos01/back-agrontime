import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiMiddleware implements NestMiddleware {
    private readonly API_KEY  = process.env.SECRET_KEY;

    use(req: Request, res: Response, next: NextFunction): void {
        const apiKeyHeader = req.headers['api-key'];

        if (!apiKeyHeader || apiKeyHeader !== this.API_KEY) {
            res.status(401).json({ message: 'Acesso não autorizado' });
            return;
        }

        next();
    }
}
