import { type AppProps } from "next/app";
import "../styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import Layout from "~/layouts/main";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export enum AppType {
  APP = "APP",
  TURBO = "TURBO",
}

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
      </ThemeProvider>
    </>
  );
};

export default App;
