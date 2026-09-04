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
exports.UpdateAssessmentTemplateDto = exports.CreateAssessmentTemplateDto = exports.CreateAssessmentCriteriaInputDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateAssessmentCriteriaInputDto {
}
exports.CreateAssessmentCriteriaInputDto = CreateAssessmentCriteriaInputDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AssessmentCategory }),
    (0, class_validator_1.IsEnum)(client_1.AssessmentCategory),
    __metadata("design:type", String)
], CreateAssessmentCriteriaInputDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssessmentCriteriaInputDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssessmentCriteriaInputDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAssessmentCriteriaInputDto.prototype, "sortOrder", void 0);
class CreateAssessmentTemplateDto {
}
exports.CreateAssessmentTemplateDto = CreateAssessmentTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssessmentTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentTemplateDto.prototype, "ageCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.RatingScaleType, default: client_1.RatingScaleType.SCALE_1_5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.RatingScaleType),
    __metadata("design:type", String)
], CreateAssessmentTemplateDto.prototype, "ratingScale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [CreateAssessmentCriteriaInputDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateAssessmentCriteriaInputDto),
    __metadata("design:type", Array)
], CreateAssessmentTemplateDto.prototype, "criteria", void 0);
class UpdateAssessmentTemplateDto {
}
exports.UpdateAssessmentTemplateDto = UpdateAssessmentTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAssessmentTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateAssessmentTemplateDto.prototype, "ageCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.RatingScaleType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.RatingScaleType),
    __metadata("design:type", String)
], UpdateAssessmentTemplateDto.prototype, "ratingScale", void 0);
//# sourceMappingURL=assessment-template.dto.js.map