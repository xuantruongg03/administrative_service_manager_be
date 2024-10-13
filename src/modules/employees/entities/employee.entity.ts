import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Person } from '../../persons/entities/persons.entity';
import { Business } from '../../businesses/entities/businesses.entity';
import CONSTANTS from 'src/common/constants';

@Entity('employees')
export class Employee {
    @PrimaryColumn({ length: CONSTANTS.LENGTH_ID })
    id: string;

    @PrimaryColumn({ length: CONSTANTS.LENGTH_ID })
    citizen_id: string;

    @ManyToOne(() => Person)
    @JoinColumn({ name: 'citizen_id' })
    person: Person;

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
