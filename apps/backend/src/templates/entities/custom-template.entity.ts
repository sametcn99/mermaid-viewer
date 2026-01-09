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
import { TemplateCollection } from './template-collection.entity';

@Entity('custom_templates')
export class CustomTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  collectionId: string;

  @ManyToOne(
    () => TemplateCollection,
    (collection) => collection.customTemplates,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'collectionId' })
  collection: TemplateCollection;

  @Column()
  name: string;

  @Column('text')
  code: string;

  @Column({ nullable: true })
  clientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'bigint', nullable: true })
  clientTimestamp: number;
}
