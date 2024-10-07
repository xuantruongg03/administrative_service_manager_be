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
import { TypeOfOrganization } from '../../type-of-organizations/entities/type-of-organization.entity';

@Entity('businesses')
export class Business {
    @PrimaryColumn({ length: 12 })
    code: string;

    @Column()
    name_vietnamese: string;

    @Column({ nullable: true })
    name_english: string;

    @Column()
    name_acronym: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    fax: string;

    @Column({ nullable: true })
    website: string;

    @Column()
    chartered_capital: string;

    @Column()
    type_of_organization: string;

    @ManyToOne(() => TypeOfOrganization)
    @JoinColumn({ name: 'type_of_organization' })
    organizationType: TypeOfOrganization;

    @Column()
    legal_representative: string;

    @ManyToOne(() => Person)
    @JoinColumn({ name: 'legal_representative' })
    representative: Person;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column()
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
