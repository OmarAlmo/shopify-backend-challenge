import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Admin {
  @PrimaryKey({type: 'uuid', unique: true})
  uuid = uuidv4();
  
  @Property({ type: 'text', unique: true})
  email!: string;

  @Property({ type: 'text'})
  password!: string;

  @Property()
  name!: string;

  @Property({type: 'text'})
  organizationName!: string;

  @Property()
  location!: string;

  @Property({type: 'date'})
  createdAt = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

}