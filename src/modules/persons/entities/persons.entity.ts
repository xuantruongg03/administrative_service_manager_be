import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import * as moment from 'moment';
import CONSTANTS from 'src/common/constants';

@Entity('persons')
export class Person {
    @PrimaryColumn({ length: CONSTANTS.LENGTH_ID })
    id: string;

    @Column({ unique: true })
    citizen_id: string;

    @Column()
    name: string;

    @Column({
        type: 'date',
        // transformer: {
        //     to(value: string | Date): string | null {
        //         if (!value) return null;
        //         if (value instanceof Date) {
        //             return value.toISOString().split('T')[0];
        //         }
        //         const momentDate = moment(
        //             value,
        //             ['DD/MM/YYYY', 'YYYY-MM-DD'],
        //             true,
        //         );
        //         return momentDate.isValid()
        //             ? momentDate.format('YYYY-MM-DD')
        //             : null;
        //     },
        //     from(value: string): Date | null {
        //         return value ? new Date(value) : null;
        //     },
        // },
    })
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

    @Column({
        type: 'date',
        // transformer: {
        //     to(value: string | Date): string | null {
        //         if (!value) return null;
        //         if (value instanceof Date) {
        //             return value.toISOString().split('T')[0];
        //         }
        //         const momentDate = moment(
        //             value,
        //             ['DD/MM/YYYY', 'YYYY-MM-DD'],
        //             true,
        //         );
        //         return momentDate.isValid()
        //             ? momentDate.format('YYYY-MM-DD')
        //             : null;
        //     },
        //     from(value: string): Date | null {
        //         return value ? new Date(value) : null;
        //     },
        // },
    })
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
