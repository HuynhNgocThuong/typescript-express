import {plainToClass} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';
import express from 'express';
import HttpException from '../exceptions/HttpException';

function validationMiddleware<T>(type: any): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type as any, req.body)).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) =>
              Object.values(error.constraints as any)
            )
            .join(', ');
          next(new HttpException(400, message));
        } else {
          next();
        }
      }
    );
  };
}

export default validationMiddleware;
