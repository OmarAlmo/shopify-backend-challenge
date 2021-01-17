import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../Context";
import { Event } from "../../models/Event";
import { User } from "../../models/User";
import { EventApplicant } from "../../models/EventApplicant";
import { eventApplicantStatuses } from "../../constants";
import { EventApplicantResponse, EventApplicantsType } from "../types/eventApplicant";
import { UserType } from "@graphql-types/user";

@Resolver()
export class EventApplicantResolver {
    @Mutation(() => String)
    async applyToEvent (
        @Arg('uuid') uuid:string,
        @Ctx() { em, req }: Context
    ) : Promise<string> {
        if (!(req.session as any).userUuid){
            return 'Please login to apply to event.'
        }
        const user = await em.findOne(User, {uuid: (req.session as any).userUuid});
        const event = await em.findOne(Event, { uuid })
        const applyToEvent = em.create(EventApplicant, {
            eventUuid: event.uuid,
            userUuid: user.uuid,
            status: eventApplicantStatuses[0]
        })

        try {
            await em.persistAndFlush(applyToEvent)
        } catch(err) {
            console.log(err.message);
        }
        return eventApplicantStatuses[0];
    }

    @Mutation(() => Boolean)
    async cancelApplication(
        @Arg('uuid') requestUuid:string,
        @Ctx() { em, req }: Context
    ) : Promise<Boolean> {
        if (!(req.session as any).userUuid){
            return false
        }

        const userUuid = (req.session as any).userUuid;
        const eventApplicant = await em.findOne(EventApplicant, { uuid: requestUuid })
        if (eventApplicant.userUuid != userUuid) {
            return false
        }  
        try {
            await em.nativeDelete(EventApplicant, { uuid: requestUuid })
            return true
        } catch {
            return false
        } 
    }

    @Query(() => EventApplicantResponse)
    async getApplicants(
        @Arg('eventUuid') eventUuid:string,
        @Ctx() { em, req }: Context
    ) : Promise<EventApplicantResponse> {
        if (!(req.session as any).adminUuid){
            return {
                errors:[{
                    field: 'admin',
                    message: 'Please login to view to post signup details.'
                }]
            }
        }
        const event = await em.findOne(Event, { uuid: eventUuid })
        if (event.adminUuid != (req.session as any).adminUuid){
            return {
                errors:[{
                    field: 'admin',
                    message: 'Unable to view details.'
                }]
            }
        }
        const applicants = await em.find(EventApplicant, { eventUuid: eventUuid })
        
        let eventApplicants : EventApplicantsType[] = [];
        
        async function getUsers(){
            for(let i=0;i<applicants.length;i++){
                let applicant = applicants[i]
                let user : UserType = await em.findOne(User, applicant.userUuid)
                let tmp : EventApplicantsType = new EventApplicantsType()
                tmp.applicant = applicant;
                tmp.user = user;
                eventApplicants.push(tmp)
            }
            return;
          };
        await getUsers()
        return { eventApplicants }
    }

    @Mutation(() => EventApplicantResponse)
    async updateAplicant(
        @Arg('uuid') applicantUuid:string,
        @Arg('status') status:string,
        @Ctx() { em, req }: Context
    ) : Promise<EventApplicantResponse> {
        if (!(req.session as any).adminUuid){
            return {
                errors:[{
                    field: 'admin',
                    message: 'Please login to view to post signup details.'
                }]
            }
        }
        const eventApplicant = await em.findOne(EventApplicant, { uuid: applicantUuid })
        const event = await em.findOne(Event, { uuid: eventApplicant.uuid })
        if (event.adminUuid != (req.session as any).adminUuid){
            return {
                errors:[{
                    field: 'admin',
                    message: 'Unable to modify details.'
                }]
            }
        }
        eventApplicant.status = status;
        em.persistAndFlush(eventApplicant);
        return { eventApplicant }
    }

}