import { AppProps } from "next/app";
import "../styles/main.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Layout from "../layouts/main";
import dynamic from "next/dynamic";
import Head from "next/head";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ThemeToggle = dynamic(
  () => import("../components/theme-toggle").then((ctx) => ctx.default),
  {
    ssr: false,
  }
);

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${fontSans.style.fontFamily};
          }
        `}
      </style>

      <Head>
        <title>Create T3 UI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Layout>
          <Component {...pageProps} />
        </Layout>

        <ThemeToggle />
      </ThemeProvider>
    </>
  );
};

export default App;
