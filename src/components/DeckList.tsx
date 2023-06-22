import { api } from "@/utils/api";
import Link from "next/link";
import { useState } from "react";

interface DeckEntryProps {
  deckId: string;
  name: string;
  description: string;
  cardCount: number;
  deleteFn: (id: string) => void;
}

function DeckListing(props: DeckEntryProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="p-2 border-b border-slate-300 flex justify-between items-center">
      <div>
        <h2 className="text-2xl">{props.name}</h2>
        <p>{props.description}</p>
        <p>{props.cardCount} cards</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 rounded-sm bg-rose-700 hover:bg-rose-900"
        >
          Delete
        </button>
        <Link
          href={`/study/${encodeURIComponent(props.deckId)}`}
          className="p-2 rounded-sm bg-blue-700 hover:bg-blue-900"
        >
          Study
        </Link>
      </div>
      {showDeleteConfirm && (
        <DeleteConfirm
          deckName={props.name}
          deckId={props.deckId}
          deleteFn={props.deleteFn}
          cancelFn={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  )
}

export default function DeckList() {
  const { data, isLoading } = api.deck.getAllInfo.useQuery();
  const utils = api.useContext();
  const mutation = api.deck.deleteDeck.useMutation({
    onSuccess: () => {
      utils.deck.getAllInfo.invalidate();
    },
  });

  function handleDelete(deckId: string) {
    mutation.mutate({ id: deckId });
  }

  if (isLoading) {
    return <div>Loading decks...</div>;
  }

  return (
    <div className="mt-2">
      {data?.map((deck) => (
        <DeckListing
          key={deck.id}
          deckId={deck.id}
          name={deck.name}
          description={deck.description}
          cardCount={deck._count.cards}
          deleteFn={handleDelete}
        />
      ))}
    </div>
  );
}

interface DeleteConfirmProps {
  deckName: string;
  deckId: string;
  deleteFn: (id: string) => void;
  cancelFn: () => void;
}

function DeleteConfirm(props: DeleteConfirmProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-50 mx-1 mb-24 rounded-sm bg-slate-700 px-6 py-12 md:bottom-auto md:top-1/4 md:mx-auto md:max-w-md">
      <p>Are you sure you want to delete {props.deckName}?</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={props.cancelFn}
          className="rounded-sm bg-blue-700 p-2 hover:bg-blue-900"
        >
          Cancel
        </button>
        <button
          onClick={() => props.deleteFn(props.deckId)}
          className="rounded-sm bg-rose-700 p-2 hover:bg-rose-900"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
