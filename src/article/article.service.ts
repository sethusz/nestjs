import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { ArticleEntity } from './article.entity'
import { CreateArticleDto } from './dto/createArticle.dto'
import { UserEntity } from '@app/user/user.entity'
import { ArticleResponseInterface } from './types/articleResponse.interface'
import slugify from 'slugify'
import { ArticlesResponseInterface } from './types/ArticlesResponseInterface.interface'

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity)
		private readonly articleRepository: Repository<ArticleEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async findAll(
		currentUserId: number,
		query: any
	): Promise<ArticlesResponseInterface> {
		const queryBuilder = this.articleRepository
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author')

		queryBuilder.orderBy('articles.createdAt', 'DESC')

		const articlesCount = await queryBuilder.getCount()

		if (query.tag) {
			queryBuilder.andWhere('articles.tagList LIKE :tag', {
				tag: `%${query.tag}%`
			})
		}
		if (query.author) {
			const author = await this.userRepository.findOne({
				where: { username: query.author }
			})

			if (author) {
				queryBuilder.andWhere('articles.authorId = :id', {
					id: author.id
				})
			} else {
				// If author not found, return empty result set
				return { articles: [], articlesCount: 0 }
			}
		}

		if (query.favorited) {
			const author = await this.userRepository.findOne({
				where: { username: query.favorited },
				relations: ['favorites']
			})

			const ids = author.favorites.map(el => el.id)

			if (ids.length > 0) {
				queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids })
			} else {
				queryBuilder.andWhere('1=0')
			}
		}

		if (query.limit) {
			queryBuilder.limit(query.limit)
		}

		if (query.offset) {
			queryBuilder.offset(query.offset)
		}

		const articles = await queryBuilder.getMany()

		let favoriteIds: number[] = []

		if (currentUserId) {
			const currentUser = await this.userRepository.findOne({
				where: { id: currentUserId },
				relations: ['favorites']
			})
			favoriteIds = currentUser.favorites.map(favorite => favorite.id)
		}

		const articleWithFavorites = articles.map(article => {
			const favorited = favoriteIds.includes(article.id)
			return { ...article, favorited }
		})

		return { articles: articleWithFavorites, articlesCount }
	}

	async createArticle(
		currentUser: UserEntity,
		createArticleDto: CreateArticleDto
	): Promise<ArticleEntity> {
		const article = new ArticleEntity()
		Object.assign(article, createArticleDto)

		if (!article.tagList) {
			article.tagList = []
		}

		article.slug = this.getSlug(createArticleDto.title)
		article.author = currentUser

		return await this.articleRepository.save(article)
	}

	async findBySlug(slug: string): Promise<ArticleEntity> {
		const article = await this.articleRepository.findOne({ where: { slug } })
		return article
	}

	async deleteArticle(
		currentUserId: number,
		slug: string
	): Promise<DeleteResult> {
		const article = await this.findBySlug(slug)

		if (!article) {
			throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
		}

		if (article.author.id !== currentUserId) {
			throw new HttpException(
				"You can't delete this article",
				HttpStatus.FORBIDDEN
			)
		}

		return await this.articleRepository.delete({ slug })
	}

	async updateSlug(
		currentUserId: number,
		slug: string,
		updateArticleDto: CreateArticleDto
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug)

		if (!article) {
			throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
		}

		if (article.author.id !== currentUserId) {
			throw new HttpException(
				"You can't update this article",
				HttpStatus.FORBIDDEN
			)
		}
		Object.assign(article, updateArticleDto)

		await this.articleRepository.save(article)

		return article
	}

	async addArticleToFavorites(
		currentUserId: number,
		slug: string
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug)
		const user = await this.userRepository.findOne({
			where: { id: currentUserId },
			relations: ['favorites']
		})

		const isNotFavorited =
			user.favorites.findIndex(
				articleInFavorites => articleInFavorites.id === article.id
			) === -1

		if (isNotFavorited) {
			user.favorites.push(article)
			article.favoritesCount++
			await this.userRepository.save(user)
			await this.articleRepository.save(article)
		}

		return article
	}

	async deleteArticleFromFavorites(
		currentUserId: number,
		slug: string
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug)
		const user = await this.userRepository.findOne({
			where: { id: currentUserId },
			relations: ['favorites']
		})

		const articleIndex = user.favorites.findIndex(
			articleInFavorites => articleInFavorites.id === article.id
		)

		if (articleIndex >= 0) {
			user.favorites.splice(articleIndex, 1)
			article.favoritesCount--
			await this.userRepository.save(user)
			await this.articleRepository.save(article)
		}

		return article
	}

	buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
		return { article }
	}

	private getSlug(title: string): string {
		return (
			slugify(title, { lower: true }) +
			'-' +
			((Math.random() * Math.pow(36, 6)) | 0).toString(36)
		)
	}
}
