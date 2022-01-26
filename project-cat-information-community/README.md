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


## 매핑을 통한 dto 확장

[관련 공식 문서](https://docs.nestjs.com/openapi/mapped-types)

데이터 전송 및 검증을 위해서 dto를 만들어서 사용한다. 하지만 상황에 맞는 dto는 다르기 때문에 여러 dto를 만들어야 한다. 

가령, 예를 들어 create 위한 dto가 아래와 같이 있다고 생각해보자.

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  age: number;
}
```
### PickType 활용하기

create 이후 id가 자동으로 생성된다고 하자. 그럼 이제 create 이후 응답으로 보내줄 때는 dto에는 id가 추가되고 password가 없어져야 한다. 이를 반영한 응답용 dto를 만들면 아래와 같다.

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class ResponseCatDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;
}
```

name과 age의 경우에는 동일한 요소임에도 다시 작성해야하는 번거로움이 있다. 이러한 문제를 해결하고 보다 쉽게 dto를 작성하기 위한 방법 중 하나인 PickType을 활용할 수 있다. PickType을 활용해서 응답용 dto를 다시 작성하면 아래와 같다.


```typescript
import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateCatDto } from './create.cat.dto';

export class ResponseCatDto extends PickType(CreateCatDto, ['name', 'age'] as const){
  @ApiProperty()
  id: number;
}
```

위와 같이 작성하면 CreateCatDto에서 name과 age를 그대로 선택해 활용하며 id값을 추가할 수 있다. 이와 유사하게 OmitType을 이용해서 특정 값에 대해서 빼는 것도 가능하다. 사용법은 PickType과 동일하다.

추가로 2개 이상의 타입을 합치기 위해서 IntersectionType도 있으니 공식문서를 참고해보자.


### PartialType

이와 유사하게 dto를 확장할 수 있는 방법으로 PartialType이 있다.

Update에 대한 예를 생각해보자. Patch를 이용하여 일부 정보를 수정할 경우 어떤 정보가 업데이트 될지 모른다. 이런 경우에 적용할 수 있는 것이 PartialType이다.

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCatDto {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty()
  age: number;
}
```

위 UpdateCatDto에서 볼 수 있듯이 name, password, age를 모두 변경할 수 있으며 이를 위해서 각각의 @IsOptional()이라는 데코레이터를 통해 해당 데이터가 없을 수 있다는 것을 표현할 수 있다.

위 코드와 동일한 역할을 하는 것을 PartialType을 활용하면 다음과 같이 만들 수 있다.

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateCatDto } from './create.cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {}
```

PartialType을 이용하면 아주 간단하게 Update를 위한 Dto를 생성할 수 있다.