/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

describe('Calculate fanction', () => {
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AppService],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
  });

  describe('calculate', () => {
    it('should return 0.082', async () => {
      expect(appService.calculate(0.82, 10, 1)).toBe(0.082);
    });
  });

  describe('calculate', () => {
    it('should return 0.8', async () => {
      expect(appService.calculate(0.4, 1, 0.2)).toBe(0.08);
    });
  });

  describe('calculate', () => {
    it('should return 464.11284046692607', async () => {
      expect(appService.calculate(1.19277e-7, 2.57e-10, 1)).toBe(
        464.11284046692607,
      );
    });
  });

  describe('calculate', () => {
    it('should throw HttpException for non-positive values', () => {
      expect(() => appService.calculate(-0.4, 1, 0.2)).toThrowError(
        new HttpException(
          'Some values are equal or less than 0',
          HttpStatusCode.BadRequest,
        ),
      );
    });
  });
});
