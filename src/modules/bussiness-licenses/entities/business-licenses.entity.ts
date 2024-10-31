import { Business } from 'src/modules/businesses/entities/businesses.entity';
import { LicenseType } from 'src/modules/license-type/entities/license-type.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('business_licenses')
export class BusinessLicense {
    @PrimaryColumn({ length: 12 })
    id: string;

    @Column({ length: 12 })
    business_code: string;

    @ManyToOne(() => Business)
    @JoinColumn({ name: 'business_code' })
    business: Business;

    @Column({ length: 12 })
    license_type_id: string;

    @ManyToOne(() => LicenseType)
    @JoinColumn({ name: 'license_type_id' })
    licenseType: LicenseType;

    @Column()
    file_path: string;

    @Column({ type: 'date', nullable: true })
    issued_date: Date;

    @Column({ type: 'date', nullable: true })
    expiry_date: Date;

    @Column({ length: 50 })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
