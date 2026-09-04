import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';
export declare class InquiriesController {
    private readonly inquiriesService;
    constructor(inquiriesService: InquiriesService);
    createPublic(dto: CreateInquiryDto): import(".prisma/client").Prisma.Prisma__PublicInquiryClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InquiryStatus;
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
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InquiryStatus;
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
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InquiryStatus;
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
