import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../Context";
import { Event } from "../../models/Event";
import { Admin } from "../../models/Admin";
import { CreateEventInput, EditEventInput, EventResponse, EventType } from "../types/event";

@Resolver()
export class EventsResolver {
    @Query(() => EventType, { nullable: true})
    event(
        @Arg('uuid', () => String) uuid: string,
        @Ctx() {em}: Context) : Promise<EventType | null>
        { return em.findOne(Event, { uuid }) }

    @Query(() => [EventType])
    events(
        @Ctx() {em}: Context) : Promise<EventType[]>
        { return em.find(Event, {}) }

    @Mutation(() => EventResponse)
    async createEvent(
        @Arg('input') input: CreateEventInput,
        @Ctx() { em, req }: Context
    ) : Promise<EventResponse > {
        if (!(req.session as any).adminUuid){
            return {
                errors:[{
                    field: 'loged in',
                    message: 'Please Log in to add a new event.'
                }]
            }
        }
        const admin = await em.findOne(Admin, {uuid: (req.session as any).adminUuid});
        const event = em.create(Event, {
            adminUuid:  admin.uuid,
            organizationName: admin.organizationName,
            title: input.title,
            description: input.description,
            location: input.location
        })
        await em.persistAndFlush(event)
        return { event }
    }

    @Mutation(() => EventResponse)
    async updateEvent(
        @Arg('input') input: EditEventInput,
        @Ctx() { em, req }: Context
    ) : Promise<EventResponse> {
        if (!(req.session as any).adminUuid){
            return {
                errors:[{
                    field: 'loged in',
                    message: 'Please Log in to add edit event.'
                }]
            }
        }
        const admin = await em.findOne(Admin, {uuid: (req.session as any).adminUuid });
        const event = await em.findOne(Event, { uuid: input.uuid })
        if (event.adminUuid != admin.uuid) {
            return {
                errors: [{ field: 'id', message: 'Unable to edit event.' }]
            }
        }
        if (!event) { 
            return { errors: [{ field: 'event', message: 'Event does not exists' }]} 
        }
        if (typeof input.title !== 'undefined'){ event.title = input.title }
        if (typeof input.description !== 'undefined'){ event.description = input.description }
        if (typeof input.location !== 'undefined'){ event.location = input.location }
        await em.persistAndFlush(event)
        return { event }
    }

    @Mutation(() => Boolean)
    async deleteEvent(
        @Arg('uuid') uuid: string,
        @Ctx() { em, req }: Context
    ) : Promise<boolean> {
        if (!(req.session as any).adminUuid){
            return false
        }
        const admin = await em.findOne(Admin, {uuid: (req.session as any).adminUuid});
        const event = await em.findOne(Event, { uuid })
        if (event.adminUuid != admin.uuid) {
            return false
        }
        try {
            await em.nativeDelete(Event, { uuid })
            return true
        } catch {
            return false
        }
    }

}   