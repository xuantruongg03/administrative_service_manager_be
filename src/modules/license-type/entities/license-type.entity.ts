import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('license_types')
export class LicenseType {
    @PrimaryColumn({ length: 12 })
    id: string;

    @Column()
    name: string;

    @Column({ default: false })
    is_mandatory: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
