# Toy Proejct - Cat Information Community

## Swagger 적용하기
### 관련 package 설치하기
```bash
npm i @nestjs/swagger swagger-ui-express
```

### Swagger 삽입하기
```javascript
main.ts

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Cat Information Community')
    .setDescription('고양이 정보 공유하는 커뮤니티 플랫폼')
    .setVersion('1.0.0')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
```
@nestjs/swagger에서 제공하는 DocumentBuilder를 이용해서 설정 값을 정의한 뒤 SwaggerModule을 이용해서 Document를 생성한다.

이후 SwaggerModule에 setup 해주면 된다.
```
SwaggerModule.setup(path:string, INestApplication, OpenAPIObject)
```
setup함수는 위와 같은 인자들을 받는다. 

### Swagger UI
![swagger ui image](https://user-images.githubusercontent.com/61923768/150895177-52260e4a-f6f0-4c50-91c3-7ac4c8d3496c.png)

이후에 설정해놓은 /docs로 이동하면 위와 같은 화면을 볼 수 있다.
config에 설정했던 Title, description, version이 상단에 보이는 것을 확인할 수 있다.

아래에는 controller에 설정된 http method와 path가 보인다. 여기에 설명을 추가해보자.

```javascript
cats.controller.ts

import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

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
```
위와 같이 Nest Swagger에서 여러 데코레이터를 이용해서 설명을 추가할 수 있다. 이렇게 추가된 설명을 아래와 같이 반영 된다.

![swagger summary image](https://user-images.githubusercontent.com/61923768/150912381-e599eecd-736c-4ba2-b539-ce310d3360c0.png)

