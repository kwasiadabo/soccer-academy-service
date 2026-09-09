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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerOfTheWeekController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const player_of_the_week_service_1 = require("./player-of-the-week.service");
let PlayerOfTheWeekController = class PlayerOfTheWeekController {
    constructor(service) {
        this.service = service;
    }
    getPublicFeed() {
        return this.service.findPublicFeed();
    }
    async getPublicPhoto(id, res) {
        const { buffer, mimeType } = await this.service.getPublicPhoto(id);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(buffer);
    }
};
exports.PlayerOfTheWeekController = PlayerOfTheWeekController;
__decorate([
    (0, common_1.Get)('public'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'List Player of the Week awards for the public marketing site (unauthenticated).' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Awards returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlayerOfTheWeekController.prototype, "getPublicFeed", null);
__decorate([
    (0, common_1.Get)('public/:id/photo'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get a Player of the Week photo (binary response, unauthenticated).' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Image bytes returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlayerOfTheWeekController.prototype, "getPublicPhoto", null);
exports.PlayerOfTheWeekController = PlayerOfTheWeekController = __decorate([
    (0, swagger_1.ApiTags)('player-of-the-week'),
    (0, common_1.Controller)('player-of-the-week'),
    __metadata("design:paramtypes", [player_of_the_week_service_1.PlayerOfTheWeekService])
], PlayerOfTheWeekController);
//# sourceMappingURL=player-of-the-week.controller.js.map