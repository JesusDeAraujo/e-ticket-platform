import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    userId!: string;

    @Column()
    eventId!: string;

    @Column('int')
    quantity!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice!: number;

    @Column({ default: 'PENDING' })
    status!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}