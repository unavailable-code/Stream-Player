import React, { Suspense } from "react";

import { Container } from "./_components/navbar/container";
import { Navbar } from "./_components/navbar/navbar";
import { Sidebar, SidebarSkeletton } from "./_components/sidebar";

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* {children} */}
      <div className="pt-20 h-full w-full flex ">
        <Navbar />
        <Suspense fallback={<SidebarSkeletton />}>
          <Sidebar />
        </Suspense>
        <Container>{children}</Container>
      </div>
    </>
  );
};
export default BrowseLayout;
