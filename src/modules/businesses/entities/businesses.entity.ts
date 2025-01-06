import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Person } from '../../persons/entities/persons.entity';
import { TypeOfOrganization } from '../../type-of-organizations/entities/type-of-organization.entity';
import CONSTANTS from 'src/common/constants';

@Entity('businesses')
export class Business {
    @PrimaryColumn({ length: CONSTANTS.LENGTH_ID })
    id: string;

    @Column({ length: CONSTANTS.LENGTH_ID, unique: true })
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

    @Column()
    owner_id: string;

    @ManyToOne(() => Person)
    @JoinColumn({ name: 'citizen_id' })
    owner: Person;

    @ManyToOne(() => TypeOfOrganization)
    @JoinColumn({ name: 'type_of_organization' })
    organizationType: TypeOfOrganization;

    @Column()
    legal_representative: string;

    @ManyToOne(() => Person)
    @JoinColumn({ name: 'citizen_id' })
    representative: Person;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 8,
    })
    latitude: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 8,
    })
    longitude: number;

    @Column()
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
