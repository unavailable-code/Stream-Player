import { getSelfByUsername } from "@/lib/auth-service";
import { redirect } from "next/navigation";
import { Navbar } from "./_components/navbar/navbar";
import { Sidebar } from "./_components/sidebar";
import { Container } from "./_components/sidebar/container";

interface CreatorPageProps {
  params: { username: string };
  children: React.ReactNode;
}

const CreatorLayout = async ({ params, children }: CreatorPageProps) => {
  const { username } = await params;
  const self = await getSelfByUsername(username);

  if (!self) {
    redirect("/");
  }
  return (
    <>
      <Navbar />
      <div className="flex h-full pt-20">
        <Sidebar />
        <Container>{children}</Container>
      </div>
    </>
  );
};

export default CreatorLayout;
