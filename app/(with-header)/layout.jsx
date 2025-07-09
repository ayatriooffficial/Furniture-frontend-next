import HeaderWrapper from "@/components/HeaderWrapper/HeaderWrapper";
import { Suspense } from "react";
import Loader from "@/components/Cards/Loader";

const Layout = ({ children }) => {
  return (
    <>
      <Suspense >
        <HeaderWrapper/>
      </Suspense>
      {children}
    </>
  );
};

export default Layout;
