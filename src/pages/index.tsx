import { Inter } from "next/font/google";
import Head from "next/head";
import DeckList from "@/components/DeckList";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`mx-auto flex min-h-screen max-w-2xl flex-col p-24 ${inter.className}`}
    >
      <Head>
        <title>Flashcards</title>
      </Head>
      <h1 className={`text-3xl font-bold`}>Flashcards</h1>
      <DeckList />
    </main>
  );
}
