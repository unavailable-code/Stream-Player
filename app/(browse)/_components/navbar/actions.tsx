import { Button } from "@/components/ui/button";
import { SignIn, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Clapperboard } from "lucide-react";
import Link from "next/link";

const Action = async () => {
  const user = await currentUser();
  return (
    <div className="flex items-center justify-end gap-x-2 ml-4 lg:ml-0">
      {!user && (
        <div className=" h-10 w-20 flex justify-center hover:opacity-75">
          <SignInButton>
            <Button variant="primary">Login</Button>
          </SignInButton>
        </div>
      )}
      {!!user && (
        <div className="flex items-center gap-x-4">
          <Button
            className="text-muted-foreground hover:text-secondary bg-[#2b2d35]"
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
