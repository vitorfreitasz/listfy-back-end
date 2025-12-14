import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ name: string; access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Email ou senha incorretos.',
      });
    }

    const senhaValida = await bcrypt.compare(password, user?.password);

    if (!senhaValida) {
      throw new UnauthorizedException({
        message: 'Usuário ou senha incorretos.',
      });
    }

    const payload = { sub: user.id, name: user.name };

    return {
      name: user.name,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<{ name: string; access_token: string }> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email }],
      });

      if (existingUser) {
        throw new ConflictException('E-mail já cadastrado');
      }

      const configuredSalt = Number(process.env.HASH_SALT ?? 10);
      const saltRounds =
        Number.isFinite(configuredSalt) && configuredSalt > 0
          ? configuredSalt
          : 10;
      const hash = await bcrypt.hash(password, saltRounds);

      const user = this.userRepository.create({
        name: username,
        password: hash,
        email: email,
      });

      await this.userRepository.save(user);

      const payload = {
        sub: user.id,
        name: user.name,
      };

      const token = await this.jwtService.signAsync(payload);
      return {
        name: user.name,
        access_token: token,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Erro interno.',
        func: 'register()',
      });
    }
  }
}
