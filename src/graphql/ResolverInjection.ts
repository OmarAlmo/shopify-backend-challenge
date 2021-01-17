import { AdminResolver } from "./resolvers/admin";
import { EventApplicantResolver } from "./resolvers/eventApplicant";
import { EventsResolver } from "./resolvers/event";
import { UserResolver } from "./resolvers/user";

export const resolvers : any = [
    AdminResolver,
    EventApplicantResolver,
    EventsResolver,
    UserResolver
]