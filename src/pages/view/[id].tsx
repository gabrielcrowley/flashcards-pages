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

      {data.cards && <CardView cards={data.cards} />}
    </PageLayout>
  );
}

function CardView(props: { cards: Card[] }) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-end gap-4 p-4">
        {!editMode && (
          <button className="rounded-sm bg-blue-700 p-2 hover:bg-blue-900">
            Add Card
          </button>
        )}

        {props.cards.length > 0 && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`rounded-sm bg-blue-700 p-2 hover:bg-blue-900 ${
              editMode && "bg-teal-700 hover:bg-teal-900"
            }`}
          >
            {editMode ? "Stop Editing" : "Edit Deck"}
          </button>
        )}
      </div>

      <div className="flex border-b p-4">
        <p className="basis-6/12">
          <strong>Front</strong>
        </p>
        <p className="basis-5/12">
          <strong>Back</strong>
        </p>
      </div>

      <CardList cards={props.cards} editMode={editMode} />
    </div>
  );
}

function CardList(props: { cards: Card[]; editMode: boolean }) {
  return (
    <div>
      {props.cards &&
        props.cards.map((card) => (
          <div key={card.id} className="flex border-y p-4">
            <div className="basis-6/12">{card.front}</div>
            <div className="basis-5/12">{card.back}</div>
            {props.editMode && (
              <button className="h-full rounded-sm bg-red-700 px-2 hover:bg-red-900">
                X
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
