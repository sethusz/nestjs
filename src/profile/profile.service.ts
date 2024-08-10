import { UserEntity } from '@app/user/user.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProfileType } from './types/profile.type'
import { ProfileResponseInterface } from './types/profileResponse.interface'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async getUserByUsername(
		currentUserId: number,
		profileUsername: string
	): Promise<ProfileType> {
		const user = await this.userRepository.findOne({
			where: { username: profileUsername },
			select: ['username', 'image', 'bio']
		})

		if (!user) {
			throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
		}

		return { ...user, following: false }
	}

	buildProfileResponse(profile: any): ProfileResponseInterface {
		delete profile.email
		return { profile }
	}
}
