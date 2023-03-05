import { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`[REQUEST] ${req.url}`);

  res.on('close', () => {
    const statusCode = res.statusCode;
    console.log(`[RESPONSE] ${req.url} - Status: ${statusCode}`);
  });
  next();
}
