import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  displayName: string | null;

  @Column({ unique: true, nullable: true })
  googleId: string;

  @Column({ unique: true, nullable: true })
  githubId: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
