import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { PageLayout } from "@/components/layout";
import Link from "next/link";
import { Card } from "@prisma/client";

export default function DeckView() {
  const router = useRouter();

  if (typeof router.query.id !== "string") {
    throw new Error("ID is invalid or missing");
  }

  const { data } = api.deck.getDeckById.useQuery({ id: router.query.id });

  if (!data) return <div>Loading...</div>;

  return (
    <PageLayout>
      <div className="flex items-center justify-between border-b border-slate-300 p-4">
        <Link href={`/`} className="hover:text-slate-400">
          <h1 className="text-3xl font-bold">Flashcards</h1>
        </Link>
      </div>

      <div className="max-w-sm self-center p-6">
        <div className="flex flex-col">
          <h2 className="text-4xl font-bold">{data?.name}</h2>
          <p className="text-xl">{data?.description}</p>

          <button
            onClick={() =>
              router.push(`/study/${encodeURIComponent(data?.id)}`)
            }
            className="mt-2 rounded-sm bg-blue-700 p-2 hover:bg-blue-900"
          >
            Study Now
          </button>
        </div>
      </div>

      <div className="flex p-4">
        <p className="basis-1/2">
          <strong>Front</strong>
        </p>
        <p className="basis-1/2">
          <strong>Back</strong>
        </p>
      </div>
      {data?.cards && <CardList cards={data?.cards} />}
    </PageLayout>
  );
}

function CardList(props: { cards: Card[] }) {
  return (
    <div>
      {props.cards.map((card) => (
        <div key={card.id} className="flex border-y p-4">
          <div className="basis-1/2">{card.front}</div>
          <div className="basis-1/2">{card.back}</div>
        </div>
      ))}
    </div>
  );
}

function CardEntry() {
  const [editOptions, setEditOptions] = useState(false);

  return (
    <>
      <div className="flex">
        <div className="flex grow">
          <p className="border-y border-l px-16 py-4">Card Front</p>
          <p className="border px-16 py-4">Card Back</p>
        </div>
        <button
          className="rounded-sm bg-blue-700 p-2 hover:bg-blue-900"
          onClick={() => setEditOptions(!editOptions)}
        >
          Edit
        </button>
      </div>
      {editOptions && <EditCardMenu />}
    </>
  );
}

function EditCardMenu() {
  return (
    // Edit card drop down menu
    <div></div>
  );
}
