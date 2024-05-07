import { MigrationInterface, QueryRunner } from 'typeorm';

export class NameColumnRefactor1713718840997 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "nameEmbedding" TO "name_embedding"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "name_embedding" TO "nameEmbedding"`,
    );
  }
}
