import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('persons')
export class Person {
    @PrimaryColumn({ length: 12 })
    citizen_id: string;

    @Column()
    name: string;

    @Column()
    birth_date: Date;

    @Column()
    gender: string;

    @Column()
    nationality: string;

    @Column()
    religion: string;

    @Column()
    type_of_certificate: string;

    @Column()
    issued_by: string;

    @Column()
    issued_date: Date;

    @Column()
    hometown: string;

    @Column()
    current_address: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
