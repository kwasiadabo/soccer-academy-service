import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PlatformAdminAuthGuard } from './guards/platform-admin-jwt-auth.guard';
import { InitializeSignupPaymentDto } from './dto/initialize-signup-payment.dto';
import { OnboardAcademyDto } from './dto/onboard-academy.dto';
import { PlatformAdminLoginDto } from './dto/platform-admin-login.dto';
import { SignupAcademyDto } from './dto/signup-academy.dto';
import { SubmitPlatformLeadDto } from './dto/submit-platform-lead.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import { VerifySignupPaymentDto } from './dto/verify-signup-payment.dto';
import { PlatformAdminService } from './platform-admin.service';

// The platform-operator control plane — sits above every academy, gated by its
// own PlatformAdminAuthGuard (never the per-academy JwtAuthGuard/PermissionsGuard).
// Excluded from tenant resolution entirely (see AppModule.configure()): there is
// no "current academy" for these routes, only academies as data to operate on.
@ApiTags('platform-admin')
@Controller('platform')
export class PlatformAdminController {
  constructor(private readonly platformAdmin: PlatformAdminService) {}

  @Post('auth/login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Platform admin login.' })
  @ApiOkResponse({ description: 'Access token returned.' })
  login(@Body() dto: PlatformAdminLoginDto) {
    return this.platformAdmin.login(dto.email, dto.password);
  }

  @Post('academies')
  @UseGuards(PlatformAdminAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid platform admin token.' })
  @ApiOperation({ summary: 'Onboard a new academy with its first admin user.' })
  @ApiOkResponse({ description: 'Academy created.' })
  onboard(@Body() dto: OnboardAcademyDto) {
    return this.platformAdmin.onboardAcademy(dto);
  }

  @Get('academies')
  @UseGuards(PlatformAdminAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid platform admin token.' })
  @ApiOperation({ summary: 'List every academy with basic health figures.' })
  @ApiOkResponse({ description: 'Academies returned.' })
  list() {
    return this.platformAdmin.listAcademiesWithHealth();
  }

  @Patch('academies/:id/suspend')
  @UseGuards(PlatformAdminAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid platform admin token.' })
  @ApiOperation({ summary: 'Suspend an academy — every request to it is rejected immediately.' })
  @ApiOkResponse({ description: 'Academy suspended.' })
  suspend(@Param('id') id: string) {
    return this.platformAdmin.setAcademyStatus(id, 'SUSPENDED');
  }

  @Patch('academies/:id/reactivate')
  @UseGuards(PlatformAdminAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid platform admin token.' })
  @ApiOperation({ summary: 'Reactivate a suspended academy.' })
  @ApiOkResponse({ description: 'Academy reactivated.' })
  reactivate(@Param('id') id: string) {
    return this.platformAdmin.setAcademyStatus(id, 'ACTIVE');
  }

  // Public — the SAMS landing page's "Sign up" buttons create the academy for
  // real, immediately (see signup below); this is only for "Request a
  // walkthrough" — someone who wants a guided demo before committing.
  @Post('leads')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Submit a "request a walkthrough" lead (unauthenticated).' })
  @ApiOkResponse({ description: 'Lead recorded.' })
  submitLead(@Body() dto: SubmitPlatformLeadDto) {
    return this.platformAdmin.submitLead(dto);
  }

  // Public — the SAMS landing page's "Sign up" form. Creates the academy and
  // its first Admin account outright, with the password the signer just
  // chose — no human vetting, unlike onboard() above. The logo is optional
  // and, being a public unauthenticated route, capped at 5MB.
  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Self-serve academy signup (unauthenticated).' })
  @ApiOkResponse({ description: 'Academy created.' })
  signup(@Body() dto: SignupAcademyDto, @UploadedFile() logo?: Express.Multer.File) {
    return this.platformAdmin.signupAcademy(dto, logo);
  }

  // Public — step one of the paid signup flow: charges the configured
  // signup fee via Paystack before any academy/admin details are collected
  // as a real account. Nothing is created here.
  @Post('signup/initialize-payment')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Start the one-time signup fee payment (unauthenticated).' })
  @ApiOkResponse({ description: 'Paystack checkout URL returned.' })
  initializeSignupPayment(@Body() dto: InitializeSignupPaymentDto) {
    return this.platformAdmin.initializeSignupPayment(dto);
  }

  // Public — step two: verifies the signup fee was actually paid, then
  // creates the academy exactly like signup() above.
  @Post('signup/verify-and-create')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Verify the signup fee payment and create the academy (unauthenticated).' })
  @ApiOkResponse({ description: 'Academy created.' })
  verifySignupPayment(@Body() dto: VerifySignupPaymentDto, @UploadedFile() logo?: Express.Multer.File) {
    return this.platformAdmin.verifySignupPayment(dto, logo);
  }

  @Get('leads')
  @UseGuards(PlatformAdminAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid platform admin token.' })
  @ApiOperation({ summary: 'List submitted "bring your academy onto SAMS" leads.' })
  @ApiOkResponse({ description: 'Leads returned.' })
  listLeads() {
    return this.platformAdmin.listLeads();
  }

  // Public — the SAMS landing page's pricing section reads the live price.
  @Get('pricing')
  @ApiOperation({ summary: 'Current SAMS per-player price (unauthenticated).' })
  @ApiOkResponse({ description: 'Pricing returned.' })
  getPricing() {
    return this.platformAdmin.getPricing();
  }

  @Patch('pricing')
  @UseGuards(PlatformAdminAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid platform admin token.' })
  @ApiOperation({ summary: 'Update the SAMS per-player price. Only affects future billing periods.' })
  @ApiOkResponse({ description: 'Pricing updated.' })
  updatePricing(@Body() dto: UpdatePricingDto) {
    return this.platformAdmin.updatePricing(dto);
  }
}
