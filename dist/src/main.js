"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const nestjs_pino_1 = require("nestjs-pino");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.useLogger(app.get(nestjs_pino_1.Logger));
    const config = app.get(config_1.ConfigService);
    app.use((0, cookie_parser_1.default)());
    app.enableCors({ origin: config.get('CORS_ORIGIN'), credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.setGlobalPrefix('api', { exclude: ['/'] });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Soccer Academy Management System API')
        .setDescription('Foundation phase: identity, RBAC, and academy structure configuration')
        .setVersion('0.1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = config.get('PORT', 3000);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map