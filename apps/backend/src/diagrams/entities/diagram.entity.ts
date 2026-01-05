import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('diagrams')
export class Diagram {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column('text')
  code: string;

  @Column('jsonb', { nullable: true })
  settings: Record<string, unknown> | null;

  @Column({ nullable: true })
  clientId: string; // Original ID from frontend for sync

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'bigint', nullable: true })
  clientTimestamp: number; // Original timestamp from frontend for sync
}
