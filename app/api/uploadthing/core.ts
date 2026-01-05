import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();
export const ourFileRouter = {
  thumbnailUploader: f({
    image:{
        maxFileSize:"4MB",
        maxFileCount:1
  }})
  .middleware(async()=>{
    const self=await getSelf()
    console.log("Middleware - self:", self);
    if(!self) throw new Error("Unauthorized")
    return {user:self}
  })
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Executed")
  try {
    console.log("Upload metadata:", metadata);
    console.log("Uploaded file:", file);

    const user = metadata.user as { id: string };
    if (!user) throw new Error("User metadata missing");

    const stream = await db.stream.findUnique({ where: { userId: user.id } });
    if (!stream) throw new Error("Stream not found for user");

    const updatedStream = await db.stream.update({
      where: { userId: user.id },
      data: { thumbnailUrl: file.ufsUrl }, // ya file.ufsUrl, version check karo
    });

    return { fileUrl: file.ufsUrl };
  } catch (err) {
    console.error("onUploadComplete error:", err);
    throw err; // Ye 500 show karega console me
  }
})

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
