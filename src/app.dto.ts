import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class QueryDto {
  @ApiProperty({
    example: 'ethereum',
  })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({
    example: 'bitcoin',
    default: 'tether',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  to: string;

  @ApiProperty({ example: 100, default: 1 })
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  @Type(() => Number)
  amount: number;
}

export interface ICoinData {
  key: string;
  price: number;
  volume: number;
}

export type TResponse = {
  data: ICoinData[];
};

export interface IResult {
  amount: number;
  from: string;
  to: string;
  result: number;
}
