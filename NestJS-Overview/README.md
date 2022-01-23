# NestJS 개요

## dependencies

![nestjs basic dependency image](https://user-images.githubusercontent.com/61923768/150670755-bbd3d0dd-8013-4251-ba10-2777c1d41b5b.png)

- "@nestjs/common"/"@nestjs/core" /"@nestjs/platform-express" : nestjs 내부적으로 동작하는 라이브러리

- "reflect-metadata" : 데코레이터와 메타데이터를 위한 라이브러리
- "rimraf" : unix 명령인 rm -rf를 사용하기 위한 nodejs용 라이브러리
- "rxjs" : observable sequences를 사용하여 비동기, 이벤트 기반 프로그래밍을 구성하는 라이브러리([RxJS](https://rxjs-dev.firebaseapp.com/guide/overview))

## controller

[관련 공식 문서](https://docs.nestjs.com/controllers)

> ![nestjs 1controller image](https://docs.nestjs.com/assets/Controllers_1.png)
> 컨트롤러는 클라이언트로부터의 요청과 응답을 제어하는 책임을 가지고 있습니다.

### 컨트롤러 데코레이터

```js
import { Controller } from "@nestjs/common";

@Controller("home")
export class AppController {}
```

컨트롤러 데코레이터(@Controller())는 컨트롤러를 정의하는 데 사용하며, 기본적인 route path의 접두사를 설정할 수 있습니다.

### request 객체

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

## Provider(공급자) & Dependency Injection(의존성 주입)

[관련 공식 문서](https://docs.nestjs.com/providers)

### providers

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

### Injectable

```javascript
app.service.ts;

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {...}
}
```

app.module.ts에서 공급자로 설정된 app.service.ts는 위에서 볼 수 있는 것처럼 @Injectable() 데코레이터가 있다. 해당 데코레이터는 app.service.ts가 공급자가 될 수 있도록 한다.

### controller(사용자)

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

## Modules(모듈) & encapsulation(캡슐화)

[관련 공식 문서](https://docs.nestjs.com/modules)

### module 생성하기

모듈을 nest cli를 이용하여 생성할 수 있다.

```bash
nest g mo [module name]
```

이때 모듈 네임은 복수형으로 짓는 것을 권장한다.

![nest cli를 이용한 모듈 생성 image](https://user-images.githubusercontent.com/61923768/150684175-d88011a6-142a-48f0-906d-363ce968d1ea.png)

위와 같이 nest-cli를 이용하여 module을 생성하면 module 생성과 함께 app.module.ts의 imports에 아래와 같이 추가된다.

```javascript
app.module.ts;

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

이렇게 imports에 모듈이 추가가 된다고 하더라고 app.controller.ts에서 바로 사용할 수는 없다. 기본적으로 module은 캡슐화(encapsulation)되어 있어서 외부에서 접근할 수 없도록 막기 때문이다.

```javascript
app.controller.ts

@Controller('home')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly catsService: CatsService,
  ) {}

  @Get()
  getCatsHello(): string {
    return this.catsService.getCats();
  }
```

위와 같이 CatsService를 추가하여 사용하면 다음과 같은 의존성에 대한 에러가 발생한다.

![image](https://user-images.githubusercontent.com/61923768/150685410-ebd821e6-1955-4a53-a8f8-6268aa214cd8.png)

의존성에 대해서 해결하는 방법은 앞서 살펴보았던 provider를 이용하여 공급자로 설정해주는 것이다. 이를 적용하면 app.module.ts는 다음과 같다.

```javascript
app.module.ts;

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService, CatsService],
})
export class AppModule {}
```

이렇게 설정하는 경우 의존성 문제가 해결은 된다. 하지만 이는 좋은 방법이 아니다. AppModule class의 경우에는 해당 Module의 내부의 공급자와 소비자를 설정하며, 다른 모듈은 imports를 통해서만 접근을 하도록 역할이 부여되어 있다.

즉, CatsService에 대한 주입은 CatsModule에 의해서 이루어져야한다.

이를 실행하는 방법은 아래와 같이 CatsModule에서 exports를 통해서 제공해주는 방법이다.

```javascript
cats.module.ts;

import { Module } from "@nestjs/common";
import { CatsService } from "./cats.service";
import { CatsController } from "./cats.controller";

@Module({
  providers: [CatsService],
  controllers: [CatsController],
  exports: [CatsService],
})
export class CatsModule {}
```

이렇게 exports로 설정해주면 별도의 에러 없이 정상 동작하는 것을 확인할 수 있다.

### Middleware

[관련 공식 문서](https://docs.nestjs.com/middleware)

Middleware는 express와 동일하게 작동하며 Injectable하도록 생성한 뒤에 app.module.ts에 configure를 이용하여 적용한다.

#### Middleware 만들기

```bash
nest g mi [middleware name]
```

```javascript
logger.middleware.ts;

import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
```

#### middleware 주입하기

```javascript
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatsModule } from "./cats/cats.module";
import { LoggerMiddleware } from "./logger.middleware";

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("cats");
  }
}
```
