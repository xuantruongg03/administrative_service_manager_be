import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('type_of_organizations')
export class TypeOfOrganization {
    @PrimaryColumn({ length: 12 })
    id: string;

    @Column()
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
