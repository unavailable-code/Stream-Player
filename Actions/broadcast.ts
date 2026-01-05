"use server"

import { AccessToken } from "livekit-server-sdk"
import { getSelf } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export const getBroadcasterToken=async()=>{
    const self=await getSelf()

    if(!self){
        redirect('/sign-in')
    }

    const stream= await db.stream.findUnique({
        where:{
            userId:self.id
        }
    })
    if(!stream){
        throw new Error("Stream not found")
    }

    const token=new AccessToken(
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!,
        {
            identity: self.id,
            name:self.username
        }
    )

    token.addGrant({
        room:self.id,
        roomJoin:true,
        canPublish:true,
        canPublishData:true,
        canSubscribe:false
    })
        return token.toJwt()
}