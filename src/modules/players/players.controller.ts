import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequireAnyPermission, RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { UpdatePlayerTeamAssignmentDto } from './dto/player-team-assignment.dto';
import { UpdatePlayerStatusDto } from './dto/player-status.dto';
import { AddGuardianDto } from './dto/add-guardian.dto';
import { ConfirmRegistrationPaymentDto } from './dto/confirm-payment.dto';
import { InitiatePaystackChargeDto, VerifyPaystackChargeDto } from './dto/paystack-charge.dto';

@ApiTags('players')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.PLAYERS_VIEW)
  @ApiOperation({ summary: 'List players, optionally filtered by status, search text, or team.' })
  @ApiOkResponse({ description: 'Players returned.' })
  findAll(
    @CurrentUser() user: RequestUser,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('teamId') teamId?: string,
  ) {
    return this.playersService.findAll({ status, search, teamId }, user);
  }

  @Get('birthdays')
  @RequirePermissions(PERMISSIONS.PLAYERS_VIEW)
  @ApiOperation({ summary: 'List players with birthdays within a window of days.' })
  @ApiOkResponse({ description: 'Players returned.' })
  listBirthdays(@Query('withinDays') withinDays?: string) {
    return this.playersService.listBirthdays(withinDays ? Number(withinDays) : 30);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.PLAYERS_VIEW)
  @ApiOperation({ summary: 'Get a player by ID.' })
  @ApiOkResponse({ description: 'Player returned.' })
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }

  @Get(':id/photo')
  @RequirePermissions(PERMISSIONS.PLAYERS_VIEW)
  @ApiOperation({ summary: "Get a player's photo (binary response)." })
  @ApiOkResponse({ description: 'Image bytes returned.' })
  async getPhoto(@Param('id') id: string, @Res() res: Response) {
    const { buffer, mimeType } = await this.playersService.getPhoto(id);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.send(buffer);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.PLAYERS_MANAGE)
  @AuditLog({ action: 'PLAYER_REGISTRATION_CREATE', entityType: 'Player' })
  @ApiOperation({ summary: 'Start a player registration.' })
  @ApiCreatedResponse({ description: 'Player created.' })
  create(@Body() dto: CreatePlayerDto) {
    return this.playersService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.PLAYERS_MANAGE)
  @AuditLog({ action: 'PLAYER_UPDATE', entityType: 'Player' })
  @ApiOperation({ summary: 'Update a player.' })
  @ApiOkResponse({ description: 'Player updated.' })
  update(@Param('id') id: string, @Body() dto: UpdatePlayerDto) {
    return this.playersService.update(id, dto);
  }

  @Patch(':id/team')
  @RequireAnyPermission(PERMISSIONS.PLAYERS_MANAGE, PERMISSIONS.PLAYERS_TEAM_ASSIGN)
  @AuditLog({ action: 'PLAYER_TEAM_ASSIGN', entityType: 'Player' })
  @ApiOperation({ summary: "Update a player's team assignment." })
  @ApiOkResponse({ description: 'Assignment updated.' })
  updateTeamAssignment(@Param('id') id: string, @Body() dto: UpdatePlayerTeamAssignmentDto) {
    return this.playersService.updateTeamAssignment(id, dto);
  }

  @Patch(':id/status')
  @RequireAnyPermission(PERMISSIONS.PLAYERS_MANAGE, PERMISSIONS.PLAYERS_STATUS_MANAGE)
  @AuditLog({ action: 'PLAYER_STATUS_UPDATE', entityType: 'Player' })
  @ApiOperation({ summary: "Update a player's status." })
  @ApiOkResponse({ description: 'Status updated.' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePlayerStatusDto) {
    return this.playersService.updateStatus(id, dto.status);
  }

  @Post(':id/guardians')
  @RequirePermissions(PERMISSIONS.PLAYERS_MANAGE)
  @AuditLog({ action: 'PLAYER_GUARDIAN_ADD', entityType: 'Player' })
  @ApiOperation({ summary: 'Add a guardian to a player.' })
  @ApiCreatedResponse({ description: 'Guardian added.' })
  addGuardian(@Param('id') id: string, @Body() dto: AddGuardianDto) {
    return this.playersService.addGuardian(id, dto);
  }

  @Post(':id/submit')
  @RequirePermissions(PERMISSIONS.PLAYERS_MANAGE)
  @AuditLog({ action: 'PLAYER_REGISTRATION_SUBMIT', entityType: 'Player' })
  @ApiOperation({ summary: 'Submit a player registration for approval.' })
  @ApiCreatedResponse({ description: 'Registration submitted.' })
  submit(@Param('id') id: string) {
    return this.playersService.submit(id);
  }

  @Post(':id/approve')
  @RequirePermissions(PERMISSIONS.PLAYERS_MANAGE)
  @AuditLog({ action: 'PLAYER_REGISTRATION_APPROVE', entityType: 'Player' })
  @ApiOperation({ summary: 'Approve a player registration.' })
  @ApiCreatedResponse({ description: 'Registration approved.' })
  approve(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.playersService.approve(id, user.userId);
  }

  @Post(':id/confirm-payment')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'PLAYER_REGISTRATION_PAYMENT_CONFIRM', entityType: 'Player' })
  @ApiOperation({ summary: 'Confirm a player registration payment was received manually.' })
  @ApiCreatedResponse({ description: 'Payment confirmed.' })
  confirmPayment(
    @Param('id') id: string,
    @Body() dto: ConfirmRegistrationPaymentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.playersService.confirmPayment(id, user.userId, dto);
  }

  @Post(':id/registration-payment/paystack/charge')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'PLAYER_REGISTRATION_PAYSTACK_CHARGE', entityType: 'Player' })
  @ApiOperation({ summary: 'Initiate a Paystack charge for a registration payment.' })
  @ApiCreatedResponse({ description: 'Charge initiated.' })
  initiatePaystackCharge(@Param('id') id: string, @Body() dto: InitiatePaystackChargeDto) {
    return this.playersService.initiatePaystackRegistrationCharge(id, dto);
  }

  @Post(':id/registration-payment/paystack/verify')
  @RequirePermissions(PERMISSIONS.FINANCE_MANAGE)
  @AuditLog({ action: 'PLAYER_REGISTRATION_PAYSTACK_VERIFY', entityType: 'Player' })
  @ApiOperation({ summary: 'Verify a Paystack charge and confirm the registration payment.' })
  @ApiCreatedResponse({ description: 'Charge verified.' })
  verifyPaystackCharge(
    @Param('id') id: string,
    @Body() dto: VerifyPaystackChargeDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.playersService.verifyPaystackRegistrationCharge(id, dto.reference, user.userId);
  }

  @Post(':id/photo')
  @RequirePermissions(PERMISSIONS.PLAYERS_MANAGE)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: "Upload a player's photo." })
  @ApiCreatedResponse({ description: 'Photo uploaded.' })
  @AuditLog({ action: 'PLAYER_PHOTO_UPLOAD', entityType: 'Player' })
  uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: RequestUser,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.playersService.uploadPhoto(id, file, user.userId);
  }
}
