import { ThemeDropdown } from "@/components/theme-swticher";
import { Button } from "@/components/ui/button";
import {  SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Clapperboard } from "lucide-react";
import Link from "next/link";

const Action = async () => {
  const user = await currentUser();
  return (
    <div className="flex items-center justify-end gap-x-2 w-36 ml-3 lg:ml-0">
       <ThemeDropdown/>
      {!user && (
        <div className=" h-10 w-20 flex justify-center hover:opacity-75">
          <SignInButton>
            <Button className="bg-primary text-primary">Login</Button>
          </SignInButton>
        </div>
      )}
      {!!user && (
        <div className="flex items-center gap-x-4">
          <Button
            className=" bg-button text-theme"
            size="sm"
            asChild
          >
            <Link href={`u/${user.username}`}>
              <Clapperboard className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  );
};

export default Action;
