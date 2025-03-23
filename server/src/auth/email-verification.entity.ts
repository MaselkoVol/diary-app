import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class EmailVerification {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;
}
