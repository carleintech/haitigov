import "reflect-metadata";

import type { Server } from "node:http";
import type { PublicServiceListResponse } from "@haitigov/contracts";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { ServicesController } from "../src/services/services.controller.js";
import { PublicServicesService } from "../src/services/services.service.js";

const listResponse: PublicServiceListResponse = { items: [], nextCursor: null };

describe("public services API", () => {
  let app: INestApplication;
  let server: Server;
  const service = { list: vi.fn().mockResolvedValue(listResponse) };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [{ provide: PublicServicesService, useValue: service }],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix("v1");
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => app.close());

  it("returns the source-gated public response", async () => {
    await request(server).get("/v1/services?locale=ht").expect(200, listResponse);
    expect(service.list).toHaveBeenCalledWith({ locale: "ht" });
  });

  it("rejects unsupported locales", async () => {
    await request(server).get("/v1/services?locale=xx").expect(400);
  });
});
