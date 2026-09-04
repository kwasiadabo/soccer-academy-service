import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_ACADEMY_CODE = 'ACA';
const ACADEMY_CODE_SETTING_KEY = 'player_id.academy_code';

/**
 * Generates immutable, human-readable Player IDs, e.g. ACA-U12-2015-00427
 * (academy code - age category - birth year - sequence). The academy code is
 * configurable via ConfigurationSetting rather than hard-coded, per the
 * requirement that ID generation be configurable without a schema change.
 */
@Injectable()
export class PlayerIdService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(ageCategoryCode: string, dateOfBirth: Date): Promise<string> {
    const academyCode = await this.getAcademyCode();
    const birthYear = dateOfBirth.getUTCFullYear();
    const prefix = `${academyCode}-${ageCategoryCode}-${birthYear}-`;

    const existingCount = await this.prisma.player.count({
      where: { playerCode: { startsWith: prefix } },
    });

    return `${prefix}${String(existingCount + 1).padStart(5, '0')}`;
  }

  private async getAcademyCode(): Promise<string> {
    const setting = await this.prisma.configurationSetting.findUnique({
      where: { key: ACADEMY_CODE_SETTING_KEY },
    });
    if (setting && typeof setting.value === 'string') {
      return setting.value;
    }
    return DEFAULT_ACADEMY_CODE;
  }
}
