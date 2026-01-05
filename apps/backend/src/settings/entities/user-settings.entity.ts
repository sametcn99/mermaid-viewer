import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export interface ThemeSettings {
  themeMode: 'default' | 'light' | 'dark' | 'custom';
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
    paper: string;
    textPrimary: string;
    textSecondary: string;
    divider: string;
    mode: 'light' | 'dark';
  };
}

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('jsonb', { nullable: true })
  mermaidConfig: Record<string, unknown>;

  @Column('jsonb', { nullable: true })
  themeSettings: ThemeSettings;

  @Column('jsonb', { nullable: true, default: {} })
  keyValueStore: Record<string, unknown>;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'bigint', nullable: true })
  clientTimestamp: number;
}
