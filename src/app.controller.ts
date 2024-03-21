import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { IResult, QueryDto } from './app.dto';
import {
  ApiHideProperty,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('/currency')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Convert currencies' })
  @ApiTags('Convert')
  @ApiHideProperty()
  @ApiOkResponse({
    status: 200,
    description:
      '{ "amount": 100, "from": "ethereum", "to": "bitcoin", "result": 5.27201015489558 }',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiQuery({
    name: 'from',
    description: 'Currency to convert from',
    type: String,
  })
  @ApiQuery({
    name: 'to',
    description: 'Currency to convert to',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'amount',
    description: 'Amount to convert',
    type: Number,
    required: false,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/convert')
  convert(@Query() query: QueryDto): Promise<IResult> {
    return this.appService.convert(query);
  }
}
