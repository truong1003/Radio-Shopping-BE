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
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql.railway.internal',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'pyxXtjwcbNBURebxsnceYoWdangcxATI',
      database: process.env.DB_NAME || 'railway',
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
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
