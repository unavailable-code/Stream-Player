import { db } from "./db";
import { getSelf } from "./auth-service";

export const isFollowing =async(id:string)=>{
    try{
        const self=await getSelf()
        const otherUser=await db.user.findUnique({
            where:{
                id
            }
        })
        if(!otherUser){
            throw new Error("User doesnt exist")
        }
        if(otherUser.id==self.id){
            return true
        }
        const existingFollow=await db.follow.findFirst({
            where:{
                followerId:self.id,
                followingId:otherUser.id
            }
        })
        return !!existingFollow
    }
    catch{
        return false
    }
}

export const followUser=async(id:string)=>{
    const self=await getSelf()
    const otherUser=await db.user.findUnique({
        where:{
            id,
        },
    })
    if(!otherUser){
        throw new Error("User doesnt exist")
    }
    if(otherUser.id===self.id){
        throw new Error("Cant follow urself imo")
    }
    const existingFollow=await db.follow.findFirst({
        where:{
            followerId:self.id,
            followingId:otherUser.id
        }
    })
    if(existingFollow){
        throw new Error("Already followed")
    }
    const follow=await db.follow.create({
        data:{
            followerId:self.id,
            followingId:otherUser.id
        },
        include:{
            follower:true,
            following:true
        }
    })
    return follow
}

export const Unfollow=async(id:string)=>{
    const self=await getSelf()
    const otherUser=await db.user.findUnique({
        where:{
            id,
        }
    })
    if(!otherUser){
        throw new Error("User not found")
    }
    if(otherUser.id===self.id){
        throw new Error("Cant unfollow urself")
    }
    
    const existingFollow= await db.follow.findFirst({
        where:{
            followerId:self.id,
            followingId:otherUser.id
        }
    })
    if(!existingFollow){
        throw new Error("U r not following")
    }
    const follow=await db.follow.delete({
        where:{
            id:existingFollow.id
        },
        include:{
            following:true
        }
    })
    return follow
}

export const getFollowedUsers= async()=>{
    try{
        const self=await getSelf();
        const followedUser=await db.follow.findMany({
            where:{
                followerId:self.id,
                following:{
                    blocking:{
                        none:{
                            blockedId:self.id
                        }
                    }
                }
            },
            include:{
                following:{
                    include:{
                        stream:{
                    select:{
                        isLive:true
                    }
                }    
                    
                    }
                }
            }
        })
        
        return followedUser
    }   
    catch(err){
        return[]
    }
} 