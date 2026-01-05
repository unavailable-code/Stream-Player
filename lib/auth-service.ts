import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
export const getSelf=async()=>{
    const self=await currentUser()
    if(!self || !self.username){
        throw new Error("Unauthorized")
    }
    const user=await db.user.findUnique({
        where:{
            externalUserId:self.id
        }
    })
    if(!user){
        throw new Error("Not found")
    }
    return user;
}

export const getSelfByUsername=async(username:string)=>{
    const self=await getSelf()

    if(!self || !self.username){
        throw new Error("Unauthorized")
    }

    const user=await db.user.findUnique({
        where:{
            username
        }
    })
    if(!user){
        throw new Error("user not found")
    }

    if(self.username!==user.username){
        throw new Error("Unauthorized")
    }

    return user
}

export const handleUser=async()=>{
    const user = await currentUser();
  if (!user) {
    return null;
  }
  console.log(user?.id);
  const res = await db.user.findUnique({
    where: {
      externalUserId: user?.id,
    },
  });
  if (res) {
    console.log("Yes");
  } else {
    const newUser = await db.user.create({
      data: {
        username: user.username ?? user.firstName ?? "Anonymous",
        externalUserId: user.id,
        imgUrl: user.imageUrl ?? "",
      },
    });
    await db.stream.create({
      data: {
        name: `${user.username}'s stream`,
        userId: newUser.id,
      },
    });
    console.log("Noo");
  }
}