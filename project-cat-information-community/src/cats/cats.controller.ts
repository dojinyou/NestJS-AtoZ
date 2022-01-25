import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  PostCatApiBody,
  PostCatApiOperation,
  PostCatApiResponse,
} from './api-options/post.cat';
import { CatsService } from './cats.service';
import { CatResponsetDto } from './dto/cat.response.dto';
import { CatRequestDto } from './dto/cats.request.dto';

@Controller('cat')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @ApiOperation({
    summary: '전체 데이터 조회',
  })
  @Get()
  getAllCat() {
    return 'current cat';
  }

  @ApiOperation({
    summary: '회원가입',
    description:
      '회원가입을 위한 api로 이메일, 사용자의 이름, 패스워드를 제공해야 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
    type: CatResponsetDto,
  })
  @ApiBody({ type: CatRequestDto })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return this.catsService.signUp(body);
  }

  @ApiOperation({
    summary: '로그인',
  })
  @Post('login')
  logIn() {
    return 'login';
  }

  @ApiOperation({
    summary: '로그아웃',
  })
  @Post('logout')
  logOut() {
    return 'logout';
  }

  @ApiOperation({
    summary: '이미지 업로드',
  })
  @Post('upload/cats')
  uploadCatImg() {
    return 'logout';
  }
}
