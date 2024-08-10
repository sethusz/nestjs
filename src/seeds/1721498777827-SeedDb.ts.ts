import { MigrationInterface, QueryRunner } from 'typeorm'

export class SeedDb1721498777827 implements MigrationInterface {
	name = 'SeedDb1721498777827'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`
		)

		// password is 123
		await queryRunner.query(
			`INSERT INTO users (email, username, password) VALUES ('6Hf5A@example.com', 'johndoe', '$2b$10$PHhotfCZbdn65wza/FyGFeSaDY5mp.4Ir/XpBZGgN8xA85N.OSSgO')`
		)

		await queryRunner.query(
			`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First Article', 'First article description', 'First article body',
			'coffee, dragons', 1)`
		)

		await queryRunner.query(
			`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'second Article', 'second article description', 'second article body',
			'coffee, dragons', 1)`
		)
	}

	public async down(): Promise<void> {}
}
