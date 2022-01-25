import { CatResponsetDto } from '../dto/cat.response.dto';
import { CatRequestDto } from '../dto/cats.request.dto';

export const PostCatApiOperation = {
  summary: '회원가입',
  description:
    '회원가입을 위한 api로 이메일, 사용자의 이름, 패스워드를 제공해야 합니다.',
};
export const PostCatApiResponse = {
  status: 200,
  description: '회원가입 성공',
  type: CatResponsetDto,
};
export const PostCatApiBody = { type: CatRequestDto };
