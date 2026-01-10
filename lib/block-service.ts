import { db } from "./db";
import { getSelf } from "./auth-service";

export const isBlockedByUser=async(id:string)=>{
    try{
        const self=await getSelf()
        const otherUser= await db.user.findUnique({
            where:{
                id,
            }
        })
        if(!otherUser){
            return false
        }
        if(otherUser.id===self.id){
            return false
        }
        const existingBlock= await db.block.findFirst({
            where:{
                blockerId:otherUser.id,
                blockedId:self.id
            }
        })

        return !!existingBlock
    }
    catch{
        return false
    }
}

export const blockUser=async(id:string)=>{
    console.log(id)
    let cleanedId
    if(id.startsWith("obs-")){
        cleanedId =id.replace("obs-","")
    }
    else{
        cleanedId= id
    }
    const self=await getSelf()
    if(self.id===cleanedId){
        throw new Error("Cant block yourself")
    }
    const otherUser=await db.user.findUnique({
        where:{
            id:cleanedId,
        }
    })
    if(!otherUser){
        console.log("Other user not found")
        throw new Error("User not found")
    }
    const existingBlock=await db.block.findFirst({
        where:{
            blockerId:self.id,
            blockedId:otherUser.id
        }
    })
    if(existingBlock){
        console.log("Already blocked")
        throw new Error("Already blocked")
    }

    const block = await db.block.create({
        data:{
            blockerId:self.id,
            blockedId:otherUser.id
        },
        include:{
            blocked:true
        }
    })
    console.log(`Block : ${block}`)

    return block
}

export const unblockUser= async(id:string)=>{
    let cleanedId
    if(id.startsWith("obs-")){
        cleanedId =id.replace("obs-","")
    }
    else{
        cleanedId= id
    }
    const self =await getSelf()
    if(self.id===cleanedId){
        throw new Error("Cant unblock yourself")
    }
    const otherUser=await db.user.findUnique({
        where:{
            id:cleanedId,
        }
    })
    if(!otherUser){
        throw new Error("User doesnt exist")
    }
    

    const  existingBlock = await db.block.findFirst({
        where:{
            blockerId:self.id,
            blockedId:otherUser.id
        }
    })
    if(!existingBlock){
        throw new Error("User is already unblocked")
    }

    const unblock=await db.block.delete({
        where:{
            id:existingBlock.id
        },
        include:{
            blocked:true,
        }
    })
    return unblock
}

export const getBlockedUsers=async()=>{
    const self=await getSelf()

    const blockedUser=await db.block.findMany({
        where:{
            blockerId:self.id
        },
        include:{
            blocked:true
        }
    })

    return blockedUser
}