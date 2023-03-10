import { AppProps } from "next/app";
import "../styles/main.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "../components/theme-toggle";
import Layout from "../layouts/main";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
