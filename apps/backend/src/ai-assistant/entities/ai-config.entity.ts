import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('ai_configs')
export class AiConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: false })
  consentGiven: boolean;

  @Column({ nullable: true })
  userApiKey: string; // Encrypted API key

  @Column({ nullable: true })
  selectedModel: string;

  @Column({ type: 'bigint', nullable: true })
  lastConsentDate: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
