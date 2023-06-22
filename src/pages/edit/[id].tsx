import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";

export default function EditDeck() {
  const router = useRouter();

  if (typeof router.query.id !== "string") {
    throw new Error("ID is invalid or missing");
  }

  const deck = api.deck.getDeckById.useQuery({ id: router.query.id });

  return (
    <main className="mx-auto max-w-2xl bg-slate-900 p-24">
      <div>
        <h1 className="text-3xl">{deck.data?.name}</h1>
        <button className="mt-4 rounded-md bg-blue-700 p-2 hover:bg-blue-900">
          Add Card
        </button>
      </div>
      <div className="mt-8">
        <CardEntry />
      </div>
    </main>
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
          className="rounded-md bg-blue-700 p-2 hover:bg-blue-900"
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
