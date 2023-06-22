import { PageLayout } from "@/components/layout";
import DeckList from "@/components/DeckList";
import { CreateDeck } from "@/components/CreateDeck";

export default function Home() {
  return (
    <PageLayout>
      <div className="p-2 border-b border-slate-300 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <CreateDeck />
      </div>
      <DeckList />
    </PageLayout>

    // <main className={`mx-auto flex min-h-screen max-w-2xl flex-col p-24`}>
    //   <div className="flex gap-4">
    //     <h1 className={`text-3xl font-bold`}>Flashcards</h1>
    //     <CreateDeck />
    //   </div>
    //   <DeckList />
    // </main>
  );
}
