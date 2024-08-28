import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prisma";
import type { IUser } from "../utils/types/auth.types";

export class AuthRepo {

    private user: Prisma.UserDelegate<DefaultArgs>

    constructor(){
        this.user = prisma.user
    }

    async findUserByPublicKey(pubKey: string): Promise<IUser>{
        const user = await this.user.findUnique({
            where:{
                publicKey: pubKey    
            }
        })
        return user
    }

    async createUser(pubKey: string): Promise<IUser>{
        return await this.user.create({
            data:{
                publicKey: pubKey    
            }
        })
    }
}


export const auth = new AuthRepo()