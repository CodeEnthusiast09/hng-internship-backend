import { Controller, Get, Header } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @Header('Content-Type', 'application/json')
  async getMe() {
    return this.profileService.getProfile();
  }
}
