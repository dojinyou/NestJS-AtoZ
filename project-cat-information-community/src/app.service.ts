import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './cats/cats.schema';
import * as bcrypt from 'bcrypt';
import { CatRequestDto } from './cats/dto/cats.request.dto';

@Injectable()
export class AppService {}
