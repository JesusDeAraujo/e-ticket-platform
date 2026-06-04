import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('event_stock')
export class EventStock {
    @PrimaryColumn()
    eventId!: string;

    @Column('int')
    stock!: number;
}
