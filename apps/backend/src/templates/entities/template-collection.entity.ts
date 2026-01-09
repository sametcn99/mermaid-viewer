import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { CustomTemplate } from './custom-template.entity';

@Entity('template_collections')
export class TemplateCollection {
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

  @Column('simple-array', { default: '' })
  templateIds: string[]; // References to built-in templates

  @OneToMany(() => CustomTemplate, (template) => template.collection, {
    cascade: true,
    eager: true,
  })
  customTemplates: CustomTemplate[];

  @Column({ nullable: true })
  clientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'bigint', nullable: true })
  clientTimestamp: number;
}
