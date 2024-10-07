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

@Entity('employees')
export class Employee {
    @PrimaryColumn({ length: 12 })
    id: string;

    @PrimaryColumn({ length: 12 })
    citizen_id: string;

    @ManyToOne(() => Person)
    @JoinColumn({ name: 'citizen_id' })
    person: Person;

    @Column()
    position: string;

    @Column()
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
