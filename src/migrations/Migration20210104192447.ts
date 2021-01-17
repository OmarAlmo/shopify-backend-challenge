import { Migration } from '@mikro-orm/migrations';

export class Migration20210104192447 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("uuid" uuid not null, "email" text not null, "password" text not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("uuid");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_password_unique" unique ("password");');

    this.addSql('create table "admin" ("uuid" uuid not null, "email" text not null, "password" text not null, "name" varchar(255) not null, "organization_name" text not null, "location" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "admin" add constraint "admin_pkey" primary key ("uuid");');
    this.addSql('alter table "admin" add constraint "admin_email_unique" unique ("email");');

    this.addSql('create table "event" ("uuid" uuid not null, "admin_uuid" text not null, "organization_name" text not null, "title" varchar(255) not null, "description" text not null, "location" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "event" add constraint "event_pkey" primary key ("uuid");');
  }

}
