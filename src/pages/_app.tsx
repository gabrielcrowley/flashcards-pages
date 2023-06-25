import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { api } from "@/utils/api";
import { ClerkProvider } from "@clerk/nextjs";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Flashcards</title>
        <meta name="description" content="A flashcard study app" />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(App);
