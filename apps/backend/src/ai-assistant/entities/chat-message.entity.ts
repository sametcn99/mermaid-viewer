import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  role: 'user' | 'assistant';

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  diagramCode: string;

  @Column({ type: 'bigint' })
  timestamp: number;

  @Column({ nullable: true })
  clientId: string;
}
