"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantResolutionMiddleware = void 0;
const common_1 = require("@nestjs/common");
const academies_service_1 = require("../../modules/academies/academies.service");
const tenant_context_service_1 = require("../tenant-context/tenant-context.service");
const ACADEMY_SLUG_HEADER = 'x-academy-slug';
const ACADEMY_SLUG_QUERY_PARAM = 'academy';
const RESERVED_SUBDOMAINS = new Set(['api', 'www', 'admin']);
function extractSlug(req) {
    const headerSlug = req.headers[ACADEMY_SLUG_HEADER];
    if (typeof headerSlug === 'string' && headerSlug.trim() !== '') {
        return headerSlug.trim();
    }
    const querySlug = req.query[ACADEMY_SLUG_QUERY_PARAM];
    if (typeof querySlug === 'string' && querySlug.trim() !== '') {
        return querySlug.trim();
    }
    const host = req.headers.host ?? '';
    const hostname = host.split(':')[0];
    const labels = hostname.split('.');
    if (labels.length > 2 && !RESERVED_SUBDOMAINS.has(labels[0])) {
        return labels[0];
    }
    return null;
}
let TenantResolutionMiddleware = class TenantResolutionMiddleware {
    constructor(academies, tenantContext) {
        this.academies = academies;
        this.tenantContext = tenantContext;
    }
    async use(req, _res, next) {
        const slug = extractSlug(req);
        if (!slug) {
            throw new common_1.NotFoundException('Could not determine which academy this request belongs to. ' +
                'Use a subdomain (e.g. kapikids.sams.app), an X-Academy-Slug header, ' +
                'or a ?academy=<slug> query param.');
        }
        const academy = await this.academies.findBySlug(slug);
        if (!academy) {
            throw new common_1.NotFoundException(`No academy found for '${slug}'`);
        }
        if (academy.status === 'PAST_DUE') {
            throw new common_1.ForbiddenException("This academy's SAMS subscription has expired. Please make payment to restore access.");
        }
        if (academy.status !== 'ACTIVE') {
            throw new common_1.ForbiddenException('This academy is not currently active');
        }
        this.tenantContext.run({ academyId: academy.id, slug: academy.slug }, () => next());
    }
};
exports.TenantResolutionMiddleware = TenantResolutionMiddleware;
exports.TenantResolutionMiddleware = TenantResolutionMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [academies_service_1.AcademiesService,
        tenant_context_service_1.TenantContextService])
], TenantResolutionMiddleware);
//# sourceMappingURL=tenant-resolution.middleware.js.map