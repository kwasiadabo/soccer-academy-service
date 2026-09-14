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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
const tenant_scoped_models_1 = require("./tenant-scoped-models");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor(tenantContext) {
        super();
        this.tenantContext = tenantContext;
    }
    async onModuleInit() {
        await this.$connect();
        this.applyTenantScoping();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    applyTenantScoping() {
        const base = this;
        const tenantContext = this.tenantContext;
        const extended = base.$extends({
            name: 'tenant-scoping',
            query: {
                $allModels: {
                    async $allOperations({ model, args, query }) {
                        if (!model || !tenant_scoped_models_1.TENANT_SCOPED_MODELS.has(model)) {
                            return query(args);
                        }
                        const academyId = tenantContext.getAcademyId();
                        const [, result] = await base.$transaction([
                            base.$executeRaw `SELECT set_config('app.current_academy_id', ${academyId}, true)`,
                            query(args),
                        ]);
                        return result;
                    },
                },
            },
        });
        for (const modelName of tenant_scoped_models_1.TENANT_SCOPED_MODELS) {
            const propertyName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
            Object.defineProperty(this, propertyName, {
                get: () => extended[propertyName],
                configurable: true,
            });
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map