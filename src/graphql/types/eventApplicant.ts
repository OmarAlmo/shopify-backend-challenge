import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./error";
import { UserType } from "./user";

@ObjectType()
export class EventApplicantType {
  @Field(() => String) uuid: string
  @Field(() => String) eventUuid: string
  @Field(() => String) userUuid: string
  @Field(() => String) status!: string
  @Field(() => String) createdAt = new Date()
  @Field(() => String) updatedAt = new Date()
}

@ObjectType()
export class EventApplicantsType{
  @Field(() => EventApplicantType) applicant: EventApplicantType
  @Field(() => UserType, { nullable: true }) user : UserType
}

@ObjectType()
export class EventApplicantResponse {
    @Field(() => [FieldError], { nullable: true }) errors?: FieldError[]
    @Field(() => EventApplicantType, { nullable: true }) eventApplicant?: EventApplicantType // returned after updating applicant
    @Field(() => [EventApplicantsType], { nullable: true }) eventApplicants?: EventApplicantsType[] // used to retrieve all applicants
}