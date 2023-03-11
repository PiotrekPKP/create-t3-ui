import dynamic from "next/dynamic";
import { type PropsWithChildren } from "react";

const ThemeToggle = dynamic(
  () => import("../components/theme-toggle").then((ctx) => ctx.default),
  {
    ssr: false,
  }
);

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="mx-12 mt-24 mb-12 md:mx-24 md:mt-56">{children}</div>
      <ThemeToggle />
    </>
  );
};

export default Layout;
