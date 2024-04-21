import { MigrationInterface, QueryRunner } from "typeorm";

export class NameColumnRevert1713720409929 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "products" RENAME COLUMN "name_embedding" TO "nameEmbedding"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "products" RENAME COLUMN "nameEmbedding" TO "name_embedding"`,
        );
    }

}
