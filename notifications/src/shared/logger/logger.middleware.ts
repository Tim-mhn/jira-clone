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

// todo: check https://yflooi.medium.com/nestjs-request-and-response-logging-with-middleware-b486121e4907 to log response body
