import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models/api-error.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const responseData = err.error as Record<string, unknown>;
        const apiError: ApiError = {
          message: (responseData?.['message'] as string) || err.message,
          status: err.status,
          details: responseData,
        };
        return throwError(() => apiError);
      }
      return throwError(() => err);
    })
  );
};
