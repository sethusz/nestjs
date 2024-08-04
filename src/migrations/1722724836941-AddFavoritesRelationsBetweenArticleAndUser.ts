import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavoritesRelationsBetweenArticleAndUser1722724836941 implements MigrationInterface {
    name = 'AddFavoritesRelationsBetweenArticleAndUser1722724836941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "favoritesCound" TO "favoritesCount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "favoritesCount" TO "favoritesCound"`);
    }

}
