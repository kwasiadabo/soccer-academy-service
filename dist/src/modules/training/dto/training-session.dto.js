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
exports.RecordAttendanceDto = exports.AttendanceRecordInputDto = exports.QuickMarkAttendanceDto = exports.GetOrCreateSaturdaySessionDto = exports.UpdateTrainingSessionDto = exports.CreateTrainingSessionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateTrainingSessionDto {
}
exports.CreateTrainingSessionDto = CreateTrainingSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTrainingSessionDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTrainingSessionDto.prototype, "trainingGroupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTrainingSessionDto.prototype, "trainingPlanId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTrainingSessionDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingSessionDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingSessionDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingSessionDto.prototype, "location", void 0);
class UpdateTrainingSessionDto {
}
exports.UpdateTrainingSessionDto = UpdateTrainingSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
    __metadata("design:type", String)
], UpdateTrainingSessionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateTrainingSessionDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTrainingSessionDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTrainingSessionDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTrainingSessionDto.prototype, "location", void 0);
class GetOrCreateSaturdaySessionDto {
}
exports.GetOrCreateSaturdaySessionDto = GetOrCreateSaturdaySessionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetOrCreateSaturdaySessionDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Defaults to today; rolled back to the Saturday of its week' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetOrCreateSaturdaySessionDto.prototype, "date", void 0);
class QuickMarkAttendanceDto {
}
exports.QuickMarkAttendanceDto = QuickMarkAttendanceDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QuickMarkAttendanceDto.prototype, "playerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.AttendanceStatus, default: 'PRESENT' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AttendanceStatus),
    __metadata("design:type", String)
], QuickMarkAttendanceDto.prototype, "status", void 0);
class AttendanceRecordInputDto {
}
exports.AttendanceRecordInputDto = AttendanceRecordInputDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AttendanceRecordInputDto.prototype, "playerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AttendanceStatus }),
    (0, class_validator_1.IsEnum)(client_1.AttendanceStatus),
    __metadata("design:type", String)
], AttendanceRecordInputDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttendanceRecordInputDto.prototype, "remarks", void 0);
class RecordAttendanceDto {
}
exports.RecordAttendanceDto = RecordAttendanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AttendanceRecordInputDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AttendanceRecordInputDto),
    __metadata("design:type", Array)
], RecordAttendanceDto.prototype, "records", void 0);
//# sourceMappingURL=training-session.dto.js.map