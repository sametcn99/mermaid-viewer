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
      this.configureBodyParser();
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

  private configureBodyParser(): void {
    // Enable CORS if needed
    this.app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:4020',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    this.logger.log('Body parser and CORS configured');
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
    const port = process.env.PORT ?? 4020;
    await this.app.listen(port);
    this.logger.log(`Application is running on: http://localhost:${port}`);
    this.logger.log(
      `Swagger documentation available at: http://localhost:${port}/api/docs`,
    );
  }
}

// Bootstrap the application
const main = new MainApplication();
void main.bootstrap();
