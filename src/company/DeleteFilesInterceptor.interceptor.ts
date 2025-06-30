import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { finalize, Observable, tap } from 'rxjs';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class DeleteFilesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(

      finalize(async () => {
        const response: Response = context.switchToHttp().getResponse();
        const request: any = context.switchToHttp().getRequest();

        if (response.statusCode != 200 && 201) {
          for (let file of request.UploadedFiles) {
            const filePath = path.resolve(__dirname, "..", "..", "uploads", file.filename);
            await fs.unlink(filePath);
          }
        }
      }
    ))
  }
}
