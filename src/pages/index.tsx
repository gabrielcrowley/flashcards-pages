import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Head>
        <title>Flashcards</title>
      </Head>
      <h1 className={`text-3xl font-bold`}>Flashcards</h1>
    </main>
  );
}
