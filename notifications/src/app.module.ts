import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule, GlobalAuthGuardProvider } from './auth';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './notifications/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [GlobalAuthGuardProvider],
})
export class AppModule {}
