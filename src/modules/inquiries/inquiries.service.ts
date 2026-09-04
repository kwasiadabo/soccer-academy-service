import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateInquiryDto) {
    return this.prisma.publicInquiry.create({
      data: {
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
    return this.prisma.publicInquiry.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateStatus(id: string, dto: UpdateInquiryStatusDto) {
    const inquiry = await this.prisma.publicInquiry.findUnique({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }
    return this.prisma.publicInquiry.update({ where: { id }, data: { status: dto.status } });
  }
}
