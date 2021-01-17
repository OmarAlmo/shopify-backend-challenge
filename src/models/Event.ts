import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Event {
  @PrimaryKey({type: 'uuid'})
  uuid = uuidv4();

  @Property({type: 'text'})
  adminUuid: string

  @Property({type: 'text'})
  organizationName: string

  @Property()
  title!: string;

  @Property({type: 'text'})
  description!: string;

  @Property()
  location!: string;

  @Property({type: 'date'})
  createdAt = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();


}