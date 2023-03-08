import { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const now = new Date().toLocaleString();

  const method = req.method;
  const methodAndUrl = `${method} ${req.url}`;
  const stringifiedBody = JSON.stringify(req.body);

  console.log(`[REQUEST] - ${now} LOG - ${methodAndUrl} - ${stringifiedBody}`);

  res.on('close', () => {
    const statusCode = res.statusCode;
    const now = new Date().toLocaleString();

    console.log(
      `[RESPONSE] - ${now} LOG - ${methodAndUrl} Status:${statusCode}`,
    );
  });
  next();
}
