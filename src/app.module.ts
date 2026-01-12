import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule, BranchModule, MembershipModule, TrainerModule, UserAuthModule, UserModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.CONNECTION_URL_HOST),
    AdminModule, UserAuthModule, UserModule, BranchModule,
    MembershipModule, TrainerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
