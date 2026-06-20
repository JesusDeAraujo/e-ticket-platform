import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('event_stock')
export class EventStock {
    @PrimaryColumn()
    eventId!: string;

    @Column('int')
    stock!: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    price!: number;
}
