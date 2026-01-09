import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

class MainApplication {
  private readonly logger = new Logger(MainApplication.name);
  private app!: INestApplication;

  async bootstrap(): Promise<void> {
    try {
      await this.createApplication();
      this.configureCors();
      this.configureSwagger();
      this.configureGlobalPipes();
      await this.startServer();
    } catch (error) {
      this.logger.error('Failed to start application', error);
      process.exit(1);
    }
  }

  private async createApplication(): Promise<void> {
    this.app = await NestFactory.create(AppModule);
    this.logger.log('NestJS application created successfully');
  }

  private configureCors(): void {
    this.app.enableCors({
      origin: ['http://localhost'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  }

  private configureSwagger(): void {
    const config = new DocumentBuilder()
      .setTitle('Fullstack Template API')
      .setDescription(
        'API documentation for the fullstack template application',
      )
      .setVersion('1.0')
      .addTag('api')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup('api/docs', this.app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    this.logger.log('Swagger documentation configured at /api/docs');
  }

  private configureGlobalPipes(): void {
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    this.logger.log('Global validation pipes configured');
  }

  private async startServer(): Promise<void> {
    await this.app.listen(3001, '0.0.0.0');
    this.logger.log(`Application is running on: http://localhost:3001`);
    this.logger.log(
      `Swagger documentation available at: http://localhost:3001/api/docs`,
    );
  }
}

// Bootstrap the application
const main = new MainApplication();
void main.bootstrap();
