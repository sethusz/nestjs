import { Controller, Get, Param } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { User } from '@app/user/decorators/user.decorator'
import { ProfileResponseInterface } from './types/profileResponse.interface'

@Controller('profiles')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get(':username')
	async getUsername(
		@User('id') currentUserId: number,
		@Param('username') profileUsername: string
	): Promise<ProfileResponseInterface> {
		const profile = await this.profileService.getUserByUsername(
			currentUserId,
			profileUsername
		)
		return this.profileService.buildProfileResponse(profile)
	}
}
