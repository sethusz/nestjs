import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { User } from '@app/user/decorators/user.decorator'
import { ProfileResponseInterface } from './types/profileResponse.interface'
import { AuthGuard } from '@app/user/guard/auth.guard'

@Controller('profiles')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get(':username')
	async getProfile(
		@User('id') currentUserId: number,
		@Param('username') profileUsername: string
	): Promise<ProfileResponseInterface> {
		const profile = await this.profileService.getProfile(
			currentUserId,
			profileUsername
		)
		return this.profileService.buildProfileResponse(profile)
	}

	@Post(':username/follow')
	@UseGuards(AuthGuard)
	async follow(
		@User('id') currentUserId: number,
		@Param('username') profileUsername: string
	): Promise<ProfileResponseInterface> {
		const profile = await this.profileService.followProfile(
			currentUserId,
			profileUsername
		)
		return this.profileService.buildProfileResponse(profile)
	}

	@Delete(':username/follow')
	@UseGuards(AuthGuard)
	async unfollow(
		@User('id') currentUserId: number,
		@Param('username') profileUsername: string
	): Promise<ProfileResponseInterface> {
		const profile = await this.profileService.unfollowProfile(
			currentUserId,
			profileUsername
		)
		return this.profileService.buildProfileResponse(profile)
	}
}
