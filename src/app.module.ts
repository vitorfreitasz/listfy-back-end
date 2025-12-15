import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { ListModule } from './modules/lists/list.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { ListItemsModule } from './modules/list-items/list-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const username = configService.get<string>('TYPEORM_USERNAME');
        const password = configService.get<string>('TYPEORM_PASSWORD');
        const database = configService.get<string>('TYPEORM_DATABASE');
        const host = configService.get<string>('TYPEORM_HOST');
        const port = configService.get<number>('TYPEORM_PORT');

        const sslEnabled = configService.get<string>('TYPEORM_SSL') === 'true';

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          entities: ['dist/modules/**/entities/*.entity{.ts,.js}'],
          migrations: ['dist/database/migrations/*{.ts,.js}'],
          cli: {
            migrationsDir: 'src/database/migrations',
          },
          ssl: sslEnabled
            ? {
                rejectUnauthorized: false,
              }
            : false,
        };
      },
    }),
    UserModule,
    ListModule,
    AuthModule,
    ListItemsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
