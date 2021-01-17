import { Migration } from '@mikro-orm/migrations';

export class Migration20210104203947 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "event_applicant" ("uuid" uuid not null, "event_uuid" text not null, "user_uuid" text not null, "status" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "event_applicant" add constraint "event_applicant_pkey" primary key ("uuid");');

    this.addSql('alter table "admin" add constraint "admin_uuid_unique" unique ("uuid");');
  }

}
