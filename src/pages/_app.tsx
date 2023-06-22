import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { api } from "@/utils/api";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Flashcards</title>
        <meta name="description" content="A flashcard study app" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(App);
