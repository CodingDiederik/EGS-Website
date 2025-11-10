import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1762805465677 implements MigrationInterface {
  name = 'Migration1762805465677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "article" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "title" character varying NOT NULL,
                "content" text NOT NULL,
                "publicAuthor" character varying NOT NULL,
                "publicationDate" TIMESTAMP,
                CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "article"
        `);
  }
}
