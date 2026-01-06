import { ThemeDropdown } from "@/components/theme-swticher";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";

const Action = () => {
  return (
    <div className="flex items-center justify-end w-10 gap-x-2">
      <ThemeDropdown/>

      <Button
        size="sm"
        className="text-muted-foreground bg-transparent hover:text-white hover:bg-transparent "
        asChild
      >
        <Link href="/">
          <LogOut className="h-5 w-5 mr-2" />
          Exit
        </Link>
      </Button>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Action;
