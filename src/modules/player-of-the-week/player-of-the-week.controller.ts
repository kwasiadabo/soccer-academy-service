import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { PlayerOfTheWeekService } from './player-of-the-week.service';

// Both routes are intentionally guard-free — this is the public marketing site's
// "Player of the Week" carousel, unauthenticated by design (see InquiriesController
// for the same pattern).
@ApiTags('player-of-the-week')
@Controller('player-of-the-week')
export class PlayerOfTheWeekController {
  constructor(private readonly service: PlayerOfTheWeekService) {}

  @Get('public')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: 'List Player of the Week awards for the public marketing site (unauthenticated).' })
  @ApiOkResponse({ description: 'Awards returned.' })
  getPublicFeed() {
    return this.service.findPublicFeed();
  }

  @Get('public/:id/photo')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: 'Get a Player of the Week photo (binary response, unauthenticated).' })
  @ApiOkResponse({ description: 'Image bytes returned.' })
  async getPublicPhoto(@Param('id') id: string, @Res() res: Response) {
    const { buffer, mimeType } = await this.service.getPublicPhoto(id);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(buffer);
  }
}
