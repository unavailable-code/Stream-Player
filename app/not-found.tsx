import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col space-y-4 items-center justify-center text-muted-foreground">
      <h1 className="text-4xl">404</h1>
      <p>We couldn&apos;t find the page you were looking for</p>
      <Button asChild className="bg-gray-700 text-white">
        <a href="/">Go back home</a>
      </Button>
    </div>
  );
};

export default NotFoundPage;
