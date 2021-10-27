import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_menu_items' })
export class UserMenuItemOrm {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  order!: number;

  @Column()
  isAdmin!: boolean;
}
