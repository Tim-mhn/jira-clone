import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { logger } from './logger.middleware';
import { createRequest, createResponse } from 'node-mocks-http';
import { INestApplication } from '@nestjs/common';
import EventEmitter from 'events';
describe('logger Middleware:', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.spyOn(console, 'log');
  });

  it('should log when the request is called with the url ', () => {
    const url = 'http://api/users/123';

    const mockRequest = buildMockRequest(url);

    const response = createResponse();

    const nextFunction = () => null;

    logger(mockRequest, response, nextFunction);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining(url));
  });

  it('should log the status code of the response once after its completed ', () => {
    const url = 'http://api/users/123';

    const statusCode = 500;
    const mockRequest = buildMockRequest(url);

    const response = createResponse();

    // response.

    const nextFunction = () => null;
    response.sendStatus(statusCode);
    response.send({});

    logger(mockRequest, response, nextFunction);

    response.end();

    response.on('close', () => {
      expect(console.log).lastCalledWith(expect.stringContaining('500'));
    });
  });

  afterAll(() => app.close());
});

function buildMockRequest(url: string) {
  return createRequest({
    method: 'GET',
    url,
    params: {
      id: 42,
    },
    headers: {
      Origin: 'http://localhost:5050/',
    },
  });
}
