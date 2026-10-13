import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";

import { AppModule } from "./app.module.js";

function readPort(value: string | undefined): number {
  if (value === undefined) {
    return 3000;
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.setGlobalPrefix("v1");
  app.enableShutdownHooks();

  const openApiConfig = new DocumentBuilder()
    .setTitle("HaitiGov Public API")
    .setDescription(
      "Public API for the proposed HaitiGov platform. It is not an official Government of Haiti API.",
    )
    .setVersion("1.0")
    .build();
  const openApiDocument = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup("openapi", app, openApiDocument);

  await app.listen(readPort(process.env.PORT), "127.0.0.1");
}

await bootstrap();
