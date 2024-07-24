import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/createArticle.dto'
import { AuthGuard } from '@app/user/guard/auth.guard'
import { UserEntity } from '@app/user/user.entity'
import { User } from '@app/user/decorators/user.decorator'

@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Post()
	@UseGuards(AuthGuard)
	async create(
		@User() currentUser: UserEntity,
		@Body('article') CreateArticleDto: CreateArticleDto
	): Promise<any> {
		return this.articleService.createArticle(currentUser, CreateArticleDto)
	}
}
