import { Children } from "react";

export default function Page({children}:{children:React.ReactNode}){
    return(
        <div className="flex justify-center items-center h-screen">
            {children}
        </div>
    )
}