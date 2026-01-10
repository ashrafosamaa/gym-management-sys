import { MongooseModule } from "@nestjs/mongoose";
import { Admin, adminSchema } from "./models/admin.model";
import { User, userSchema } from "./models/user.model";
import { Branch, branchSchema } from "./models/branch.model";



export const models = MongooseModule.forFeature([
    {name : Admin.name , schema : adminSchema},
    {name : User.name , schema : userSchema},
    {name : Branch.name , schema : branchSchema},
])
