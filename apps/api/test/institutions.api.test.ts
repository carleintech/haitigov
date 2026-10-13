import "reflect-metadata";

import type { Server } from "node:http";
import type { PublicInstitutionDetail, PublicInstitutionListResponse } from "@haitigov/contracts";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { InstitutionsController } from "../src/institutions/institutions.controller.js";
import { InstitutionsService } from "../src/institutions/institutions.service.js";

const summary = {
  acronym: "TST",
  aliases: [],
  branch: "EXECUTIVE",
  institutionId: "HT-TEST-001",
  officialName: "Development fixture institution",
  parentInstitutionId: null,
  status: "UNKNOWN",
  type: "OTHER",
  verificationStatus: "VERIFIED_CURRENT",
} as const;

const listResponse: PublicInstitutionListResponse = {
  items: [summary],
  nextCursor: null,
};

const detailResponse: PublicInstitutionDetail = {
  ...summary,
  jurisdiction: "Development fixture",
  offices: [],
  relationships: [],
  sources: [],
  verificationEvents: [],
};

describe("institutions public API", () => {
  let app: INestApplication;
  let server: Server;
  const service = {
    getById: vi.fn().mockResolvedValue(detailResponse),
    list: vi.fn().mockResolvedValue(listResponse),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [InstitutionsController],
      providers: [{ provide: InstitutionsService, useValue: service }],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix("v1");
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it("lists institutions with validated filters", async () => {
    const response = await request(server)
      .get("/v1/institutions?type=OTHER&status=UNKNOWN&limit=25")
      .expect(200);

    expect(response.body).toEqual(listResponse);
    expect(service.list).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 25, status: "UNKNOWN", type: "OTHER" }),
    );
  });

  it("gets an institution by canonical ID", async () => {
    const response = await request(server).get("/v1/institutions/HT-TEST-001").expect(200);

    expect(response.body).toEqual(detailResponse);
    expect(service.getById).toHaveBeenCalledWith("HT-TEST-001");
  });

  it.each([
    "/v1/institutions?type=INVALID",
    "/v1/institutions?limit=101",
    "/v1/institutions?verificationStatus=PENDING_REVIEW",
    "/v1/institutions/not-canonical",
  ])("rejects invalid public input at %s", async (path) => {
    const response = await request(server).get(path).expect(400);

    expect(response.body).toMatchObject({ code: "VALIDATION_FAILED" });
  });
});
