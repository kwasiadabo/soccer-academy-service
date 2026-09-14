import { INestApplication } from '@nestjs/common';
import request from 'supertest';

// Every request now needs to resolve to an academy (see TenantResolutionMiddleware) —
// e2e tests have no real subdomain to do that with, so this stands in for one via the
// same X-Academy-Slug override header the app already supports in development.
export function tenantRequest(app: INestApplication, slug = 'kapikids') {
  const server = app.getHttpServer();
  const withSlug = (test: request.Test) => test.set('X-Academy-Slug', slug);

  return {
    get: (url: string) => withSlug(request(server).get(url)),
    post: (url: string) => withSlug(request(server).post(url)),
    patch: (url: string) => withSlug(request(server).patch(url)),
    put: (url: string) => withSlug(request(server).put(url)),
    delete: (url: string) => withSlug(request(server).delete(url)),
  };
}
