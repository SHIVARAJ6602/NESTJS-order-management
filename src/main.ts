import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create a Swagger configuration using DocumentBuilder
  const config = new DocumentBuilder()
    .setTitle('NestJS-based microservice') // Set the title of your API
    .setDescription('Order Management API') // Describe your API
    .setVersion('1.0') // Set the version of your API
    .addBearerAuth() // Add authentication method (optional)
    .build();

  // Create the Swagger document using the configuration
  const document = SwaggerModule.createDocument(app, config);

  // Save the OpenAPI contract to a file (JSON format)
  const jsonDoc = JSON.stringify(document, null, 2);
  writeFileSync('swagger-spec.json', jsonDoc); // Save the contract to a file

  // Setup Swagger UI on a specific route (e.g., /api-docs)
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
