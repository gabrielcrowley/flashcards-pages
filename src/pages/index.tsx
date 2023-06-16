import { Inter } from "next/font/google";
import Head from "next/head";
import { trpc } from "@/utils/trpc";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const hello = trpc.hello.useQuery({ text: 'tRPC' });
  if (!hello.data) {
    return <div>Loading...</div>
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <Head>
        <title>Flashcards</title>
      </Head>
      <h1 className={`text-3xl font-bold`}>Flashcards</h1>
      <p>{hello.data.greeting}</p>
    </main>
  );
}