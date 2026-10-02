import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';
export declare class InquiriesService {
    private readonly prisma;
    private readonly tenantContext;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    create(dto: CreateInquiryDto): import(".prisma/client").Prisma.Prisma__PublicInquiryClient<{
        id: string;
        status: import(".prisma/client").$Enums.InquiryStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        message: string | null;
        childFirstName: string;
        childLastName: string;
        childDateOfBirth: Date | null;
        guardianName: string;
        guardianPhone: string;
        guardianEmail: string | null;
        preferredProgram: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        status: import(".prisma/client").$Enums.InquiryStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        message: string | null;
        childFirstName: string;
        childLastName: string;
        childDateOfBirth: Date | null;
        guardianName: string;
        guardianPhone: string;
        guardianEmail: string | null;
        preferredProgram: string | null;
    }[]>;
    updateStatus(id: string, dto: UpdateInquiryStatusDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.InquiryStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        message: string | null;
        childFirstName: string;
        childLastName: string;
        childDateOfBirth: Date | null;
        guardianName: string;
        guardianPhone: string;
        guardianEmail: string | null;
        preferredProgram: string | null;
    }>;
}
