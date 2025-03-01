import { User } from 'src/users/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: true /*  remove nullable later */ })
  date: Date;

  @Column({ type: 'varchar', length: 120, nullable: true })
  title: string;

  @Column({ type: 'json', nullable: true /*  remove nullable later */ })
  content: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.notes)
  author: User;
}
