import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class GenerateIdService {
    private length: number = parseInt(process.env.LENGHT_ID);

    constructor(private readonly entityManager: EntityManager) {}

    private generateId(): string {
        return Math.random()
            .toString(36)
            .substring(2, this.length + 2);
    }

    async checkIdExists(
        nameTable: string,
        primaryKey: string,
        id: string,
    ): Promise<boolean> {
        const existingEntity = await this.entityManager.findOne(nameTable, {
            where: { [primaryKey]: id },
        });

        return !!existingEntity;
    }

    async generatePrimaryKey(
        nameTable: string,
        primaryKey: string,
    ): Promise<string> {
        const id = this.generateId();
        const existingEntity = await this.checkIdExists(
            nameTable,
            primaryKey,
            id,
        );

        if (existingEntity) {
            // If the ID already exists, recursively call the function to generate a new one
            return this.generatePrimaryKey(nameTable, primaryKey);
        }

        return id;
    }
}
