# NestJS 개요

## NestJS 구조

### dependencies

![nestjs basic dependency image](https://user-images.githubusercontent.com/61923768/150670755-bbd3d0dd-8013-4251-ba10-2777c1d41b5b.png)

- "@nestjs/common"/"@nestjs/core" /"@nestjs/platform-express" : nestjs 내부적으로 동작하는 라이브러리

- "reflect-metadata" : 데코레이터와 메타데이터를 위한 라이브러리
- "rimraf" : unix 명령인 rm -rf를 사용하기 위한 nodejs용 라이브러리
- "rxjs" : observable sequences를 사용하여 비동기, 이벤트 기반 프로그래밍을 구성하는 라이브러리([RxJS](https://rxjs-dev.firebaseapp.com/guide/overview))

### controller

[관련 공식 문서](https://docs.nestjs.com/controllers)

> ![nestjs 1controller image](https://docs.nestjs.com/assets/Controllers_1.png)
> 컨트롤러는 클라이언트로부터의 요청과 응답을 제어하는 책임을 가지고 있습니다.

#### 컨트롤러 데코레이터

```js
import { Controller } from "@nestjs/common";

@Controller("home")
export class AppController {}
```

컨트롤러 데코레이터(@Controller())는 컨트롤러를 정의하는 데 사용하며, 기본적인 route path의 접두사를 설정할 수 있습니다.

#### request 객체

@nestjs/common에서 제공하는 @Req, @Body, @Param의 데코레이터를 활용해서 원하는 값들은 인자로 받을 수 있다.

```javascript
app.controller.ts

import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller('home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getHello(@Req() Req: Request, @Body() Body, @Param() Param): string {
    console.log('🚀 ~ file: app.controller.ts ~ line 11 ~  Param', Param);
    console.log('🚀 ~ file: app.controller.ts ~ line 11 ~ Body', Body);
    console.log('🚀 ~ file: app.controller.ts ~ line 11 ~ Req', Req);
    return this.appService.getHello();
  }
}
```

![image](https://user-images.githubusercontent.com/61923768/150675051-742ee7a6-e498-4d96-a996-bafc171fece6.png)
위에 보는 것과 같이 Request 객체 속의 Body data와 Parameter를 데코레이터를 활용해서 손쉽게 얻을 수도 있으며 Request 객체를 바로 받을 수도 있다. 뿐만 아니라 query나 header 등도 가져올 수 있으며 인자를 넣어 특정값만을 가져올 수도 있다.

### Dependency Injection(의존성 주입)

#### Provider(공급자)

```javascript
app.module.ts;

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

위 코드은 NestJS의 기본 데코레이터인 Module이다. 모듈 데코레이터의 인자 중 providers는 Injectable한 클래스를 공급자로 설정하여 Dependency를 주입하는 역할을 한다.

이렇게 공급자로 설정된 클래스들은 controllers에 정의된 소비자가 사용할 수 있다.

```javascript
app.service.ts;

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {...}
}
```

app.module.ts에서 공급자로 설정된 app.service.ts는 위에서 볼 수 있는 것처럼 @Injectable() 데코레이터가 있다. 해당 데코레이터는 app.service.ts가 공급자가 될 수 있도록 한다.

```javascript
app.controller.ts

import { Controller} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('home')
export class AppController {
  constructor(private readonly appService: AppService) {}
  ...
}
```

주입된 공급자는 controller로 설정된 클래스에서 constructor에서 private로 생성하여 사용한다.
