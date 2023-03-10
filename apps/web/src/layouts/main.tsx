import { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="mx-12 mt-24 md:mx-24 md:mt-48">{children}</div>;
};

export default Layout;
