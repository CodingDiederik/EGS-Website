import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762772725675 implements MigrationInterface {
    name = 'Migration1762772725675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME COLUMN "hashedPassword" TO "password"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME COLUMN "password" TO "hashedPassword"
        `);
    }

}
