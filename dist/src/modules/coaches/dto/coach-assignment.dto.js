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
exports.EndCoachAssignmentDto = exports.CreateCoachAssignmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateCoachAssignmentDto {
}
exports.CreateCoachAssignmentDto = CreateCoachAssignmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCoachAssignmentDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCoachAssignmentDto.prototype, "trainingGroupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.CoachAssignmentRole, default: client_1.CoachAssignmentRole.PRIMARY }),
    (0, class_validator_1.IsEnum)(client_1.CoachAssignmentRole),
    __metadata("design:type", String)
], CreateCoachAssignmentDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCoachAssignmentDto.prototype, "effectiveFrom", void 0);
class EndCoachAssignmentDto {
}
exports.EndCoachAssignmentDto = EndCoachAssignmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], EndCoachAssignmentDto.prototype, "effectiveTo", void 0);
//# sourceMappingURL=coach-assignment.dto.js.map