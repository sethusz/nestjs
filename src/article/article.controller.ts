import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/createArticle.dto'
import { AuthGuard } from '@app/user/guard/auth.guard'
import { UserEntity } from '@app/user/user.entity'
import { User } from '@app/user/decorators/user.decorator'
import { ArticleResponseInterface } from './types/articleResponse.interface'
import { ArticlesResponseInterface } from './types/ArticlesResponseInterface.interface'

@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Get()
	async findAlls(
		@User('id') currentUserId: number,
		@Query() query: any
	): Promise<ArticlesResponseInterface> {
		return await this.articleService.findAll(currentUserId, query)
	}

	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async create(
		@User() currentUser: UserEntity,
		@Body('article') CreateArticleDto: CreateArticleDto
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.createArticle(
			currentUser,
			CreateArticleDto
		)
		return this.articleService.buildArticleResponse(article)
	}

	@Get(':slug')
	async getSingleArticle(
		@Param('slug') slug: string
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.findBySlug(slug)
		return this.articleService.buildArticleResponse(article)
	}

	@Delete(':slug')
	@UseGuards(AuthGuard)
	async deleteArticle(
		@User('id') currentUserId: number,
		@Param('slug') slug: string
	) {
		return await this.articleService.deleteArticle(currentUserId, slug)
	}

	@Put(':slug')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async updateArticle(
		@User('id') currentUserId: number,
		@Param('slug') slug: string,
		@Body('article') updateArticleDto: CreateArticleDto
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.updateSlug(
			currentUserId,
			slug,
			updateArticleDto
		)
		return this.articleService.buildArticleResponse(article)
	}

	@Post(':slug/favorite')
	@UseGuards(AuthGuard)
	async addArticleToFavorites(
		@User('id') currentUserId: number,
		@Param('slug') slug: string
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.addArticleToFavorites(
			currentUserId,
			slug
		)
		return this.articleService.buildArticleResponse(article)
	}
}
