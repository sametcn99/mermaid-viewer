import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('favorite_templates')
@Unique(['userId', 'templateId'])
export class FavoriteTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Index()
  templateId: string; // Built-in template ID

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'bigint', nullable: true })
  clientTimestamp: number;
}
