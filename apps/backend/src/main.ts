import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
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
  }

  private configureCors(): void {
    this.app.enableCors({
      origin: ['http://localhost', 'http://mermaid.sametcc.me'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  }

  private configureSwagger(): void {
    const config = new DocumentBuilder()
      .setTitle('Mermaid Viewer API')
      .setDescription('API documentation for the Mermaid Viewer application')
      .setVersion('1.0.0')
      .addTag('mermaid-viewer')
      .addBearerAuth()
      .setContact('sametcn99', 'https://sametcc.me', 'sametcn99@gmail.com')
      .addServer('http://localhost:3000', 'Frontend server')
      .addServer('http://localhost:3001', 'Local server')
      .addServer('https://mermaid.sametcc.me/api', 'Production server')
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    this.app.use(
      '/docs',
      apiReference({
        spec: {
          content: document,
        },
      }),
    );
  }

  private configureGlobalPipes(): void {
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
  }

  private async startServer(): Promise<void> {
    await this.app.listen(3001, '0.0.0.0');
    this.logger.log(
      `Application started successfully on http://localhost:3001`,
    );
  }
}

// Bootstrap the application
const main = new MainApplication();
void main.bootstrap();
