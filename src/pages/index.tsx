import { Inter } from "next/font/google";
import DeckList from "@/components/DeckList";
import { CreateDeck } from "@/components/CreateDeck";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`mx-auto flex min-h-screen max-w-2xl flex-col p-24 ${inter.className}`}
    >
      <div className="flex gap-4">
        <h1 className={`text-3xl font-bold`}>Flashcards</h1>
        <CreateDeck />
      </div>
      <DeckList />
    </main>
  );
}
