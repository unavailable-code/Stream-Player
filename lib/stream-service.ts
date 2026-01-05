import { db } from "./db";
import { Room } from "livekit-client";
import { getBroadcasterToken } from "@/Actions/broadcast";

let room : Room | null

export const getStreamByUserId=async(userId:string)=>{
    const stream=await db.stream.findUnique({
        where:{
            userId
        }
    })
    return stream
}

