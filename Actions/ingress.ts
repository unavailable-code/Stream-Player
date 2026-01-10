"use server"

import{
    IngressAudioEncodingOptions,
    IngressInput,
    IngressClient,IngressVideoEncodingPreset,
    RoomServiceClient,
    TrackSource,
    CreateIngressOptions,
    IngressVideoOptions,
    IngressAudioOptions,
    AudioCodec
} from 'livekit-server-sdk'
import { db } from '@/lib/db'
import { getSelf } from '@/lib/auth-service'
import { revalidatePath } from 'next/cache'


const roomService=new RoomServiceClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
)
const ingressClient= new IngressClient(process.env.LIVEKIT_API_URL!,process.env.LIVEKIT_API_KEY!,process.env.LIVEKIT_API_SECRET!)


export const resetIngresses=async(hostIdentity:string)=>{
    const ingresses= await ingressClient.listIngress({
        roomName:hostIdentity
    })

    const rooms=await roomService.listRooms([hostIdentity])

    for(const room of rooms){
        await roomService.deleteRoom(room.name)
    }

    for(const ingress of ingresses){
        if(ingress.ingressId){
            await ingressClient.deleteIngress(ingress.ingressId)
        }
    }
}

export const createIngress=async(ingressType: IngressInput)=>{
    try{
    const self=await getSelf();
    await resetIngresses(self.id)
    
    const options: CreateIngressOptions={
        name:self.username,
        roomName:self.id,
        participantName:self.username,
        participantIdentity:self.id
    }
    if(ingressType===IngressInput.WHIP_INPUT){
        options.enableTranscoding=true
    }
    else{
        options.video=new IngressVideoOptions({
            name:`${self.username}'s video`,
            source:TrackSource.CAMERA,
            encodingOptions:{
                case:'preset',
                value:IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS
            }
        })
        options.audio=new IngressAudioOptions({
            name:`${self.username}'s Audio`,
            source:TrackSource.MICROPHONE,
            encodingOptions:{
                case:'options',
                value:new IngressAudioEncodingOptions({
                    audioCodec: AudioCodec.OPUS,
                    bitrate:64000,
                    channels:1
                })
            }
        })
    }
    const ingress=await ingressClient.createIngress(ingressType,options)
    if(!ingress || !ingress.url || !ingress.streamKey){
        throw new Error("Failed to create")
    }

    await db.stream.update({
        where:{
            userId:self.id
        },
        data:{
            ingressId:ingress.ingressId,
            serverUrl:ingress.url,
            streamKey:ingress.streamKey
        }
    })

    revalidatePath(`/u/${self.username}/keys`)
}
catch(err){
     throw new Error("Create ingress failed");
}
}