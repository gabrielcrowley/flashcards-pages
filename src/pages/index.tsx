import { PageLayout } from "@/components/layout";
import DeckList from "@/components/DeckList";
import { CreateDeck } from "@/components/CreateDeck";
import Link from "next/link";

export default function Home() {
  return (
    <PageLayout>
      <div className="flex items-center justify-between border-b border-slate-300 p-4">
        <Link href={`/`} className="hover:text-slate-400">
          <h1 className="text-3xl font-bold">Flashcards</h1>
        </Link>
        <CreateDeck />
      </div>
      <DeckList />
    </PageLayout>
  );
}
