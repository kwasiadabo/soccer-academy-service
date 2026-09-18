import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';

@Injectable()
export class InquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  create(dto: CreateInquiryDto) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.publicInquiry.create({
      data: {
        academyId,
        childFirstName: dto.childFirstName,
        childLastName: dto.childLastName,
        childDateOfBirth: dto.childDateOfBirth ? new Date(dto.childDateOfBirth) : undefined,
        guardianName: dto.guardianName,
        guardianPhone: dto.guardianPhone,
        guardianEmail: dto.guardianEmail,
        preferredProgram: dto.preferredProgram,
        message: dto.message,
      },
    });
  }

  findAll() {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.publicInquiry.findMany({ where: { academyId }, orderBy: { createdAt: 'desc' } });
  }

  async updateStatus(id: string, dto: UpdateInquiryStatusDto) {
    const academyId = this.tenantContext.getAcademyId();
    const inquiry = await this.prisma.publicInquiry.findFirst({ where: { id, academyId } });
    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }
    return this.prisma.publicInquiry.update({ where: { id, academyId }, data: { status: dto.status } });
  }
}
