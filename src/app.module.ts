// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './accounts/account.module';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brands/brand.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ProductModule } from './products/product.module';
import { VoucherModule } from './voucher/voucher.module';
import { CustomerModule } from './customers/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '123456',
      database: process.env.DB_NAME || 'radio_shopping',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AccountModule,
    AuthModule,
    BrandModule,
    ScheduleModule,
    ProductModule,
    VoucherModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
