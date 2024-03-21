import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError, HttpStatusCode } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import * as exactMath from 'exact-math';
import { ICoinData, IResult, QueryDto, TResponse } from './app.dto';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  calculate(
    fromCoinPrice: number,
    toCoinPrice: number,
    amount: number,
  ): number {
    if (fromCoinPrice <= 0 || toCoinPrice <= 0 || amount <= 0) {
      throw new HttpException(
        'Some values are equal or less than 0',
        HttpStatusCode.BadRequest,
      );
    } else if (
      typeof fromCoinPrice != 'number' ||
      typeof toCoinPrice != 'number' ||
      typeof amount != 'number'
    ) {
      throw new HttpException(
        'Some values are not a numbers',
        HttpStatusCode.BadRequest,
      );
    }
    const dividedCoins: number = exactMath.div(fromCoinPrice, toCoinPrice);
    const result: number = exactMath.mul(dividedCoins, amount);
    return result;
  }

  async convert(query: QueryDto): Promise<IResult> {
    const { from, to = 'tether', amount = 1 } = query;
    const { data } = await firstValueFrom(
      this.httpService
        .get<TResponse>('https://tstapi.cryptorank.io/v0/coins/prices/')
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error.response.data);
            throw new HttpException(
              'An error occured!',
              HttpStatusCode.BadGateway,
            );
          }),
        ),
    );
    const response: ICoinData[] = data.data;
    const fromCoin: ICoinData = response.find((coin) => coin.key === from);
    const toCoin: ICoinData = response.find((coin) => coin.key === to);
    if (!fromCoin || !toCoin) {
      throw new HttpException("Currency does't exist", HttpStatus.NOT_FOUND);
    }
    return {
      amount,
      from: fromCoin.key,
      to: toCoin.key,
      result: this.calculate(fromCoin.price, toCoin.price, amount),
    };
  }
}
