import CONSTANTS from 'src/common/constants';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Business } from '../../businesses/entities/businesses.entity';

@Entity('employees')
export class Employee {
    @PrimaryColumn({ length: CONSTANTS.LENGTH_ID })
    id: string;

    @Column()
    citizen_id: string;

    @Column()
    name: string;

    @Column()
    position: string;

    @Column({ nullable: true, length: 10 })
    phone: string;

    @Column()
    start_date: Date;

    @Column({ length: 12 })
    business_code: string;

    @ManyToOne(() => Business)
    @JoinColumn({ name: 'business_code' })
    business: Business;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
