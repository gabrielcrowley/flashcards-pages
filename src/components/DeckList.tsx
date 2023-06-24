import { api } from "@/utils/api";
import { Deck } from "@prisma/client";
import Link from "next/link";
import { FormEvent, useState } from "react";

interface DeckListingProps {
  deckId: string;
  name: string;
  description: string;
  cardCount: number;
}

function DeckListing(props: DeckListingProps) {
  const [editDeckForm, setEditDeckForm] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-slate-300 p-4 hover:bg-slate-800">
      <Link href={`/view/${encodeURIComponent(props.deckId)}`} className="grow">
        <div>
          <h2 className="text-2xl">{props.name}</h2>
          <p>{props.description}</p>
          <p>{props.cardCount} cards</p>
        </div>
      </Link>
      <div className="flex gap-2">
        <button
          onClick={() => setEditDeckForm(true)}
          className="rounded-sm bg-teal-700 p-2 hover:bg-teal-900"
        >
          Edit
        </button>
        <Link
          href={`/study/${encodeURIComponent(props.deckId)}`}
          className="rounded-sm bg-blue-700 p-2 hover:bg-blue-900"
        >
          Study
        </Link>
      </div>

      {editDeckForm && (
        <DeckEditForm
          deck={{
            id: props.deckId,
            name: props.name,
            description: props.description,
          }}
          hideFn={() => setEditDeckForm(false)}
        />
      )}
    </div>
  );
}

export default function DeckList() {
  const { data, isLoading } = api.deck.getAllInfo.useQuery();
  const utils = api.useContext();

  if (isLoading) {
    return <div>Loading decks...</div>;
  }

  return (
    <div>
      {data?.map((deck) => (
        <DeckListing
          key={deck.id}
          deckId={deck.id}
          name={deck.name}
          description={deck.description}
          cardCount={deck._count.cards}
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
    <div className="absolute inset-x-0 bottom-0 z-50 flex h-full flex-col justify-center rounded-sm bg-slate-700 px-6 py-12 md:max-w-md">
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

function DeckEditForm(props: { hideFn: () => void; deck: Deck }) {
  const [deckName, setDeckName] = useState(props.deck.name);
  const [deckDesc, setDeckDesc] = useState(props.deck.description);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const utils = api.useContext();
  const deleteMutation = api.deck.deleteDeck.useMutation({
    onSuccess: () => {
      utils.deck.getAllInfo.invalidate();
    },
  });

  const editMutation = api.deck.editDeck.useMutation({
    onSuccess: () => {
      utils.deck.getAllInfo.invalidate();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    props.hideFn();

    editMutation.mutate({
      deckId: props.deck.id,
      name: deckName,
      desc: deckDesc,
    });
  }

  function handleDelete(deckId: string) {
    deleteMutation.mutate({ id: deckId });
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 mx-1 mb-24 rounded-sm bg-slate-700 px-6 py-12 md:bottom-auto md:top-1/4 md:mx-auto md:max-w-md">
      <h2 className="text-2xl font-bold">Edit Deck</h2>

      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
        <input
          autoFocus
          type="text"
          id="deckName"
          name="deckName"
          value={deckName}
          placeholder="Name"
          autoComplete="off"
          onChange={(e) => setDeckName(e.target.value)}
          className="rounded-sm p-1 text-black"
        />

        <input
          type="text"
          id="deckDesc"
          name="deckDesc"
          value={deckDesc}
          placeholder="Description"
          autoComplete="off"
          onChange={(e) => setDeckDesc(e.target.value)}
          className="rounded-sm p-1 text-black"
        />

        <div className="flex justify-between">
          <div className="flex gap-2">
            <input
              type="submit"
              value="Confirm"
              className="cursor-pointer rounded-sm bg-blue-700 p-2 hover:bg-blue-900"
            />
            <button
              onClick={props.hideFn}
              className="rounded-sm bg-rose-700 p-2 hover:bg-rose-900"
            >
              Cancel
            </button>
          </div>

          <button
            type="button"
            onClick={() => setDeleteConfirm(true)}
            className="justify-self-end rounded-sm bg-red-700 p-2 hover:bg-red-900"
          >
            Delete Deck
          </button>
        </div>
      </form>
      {deleteConfirm && (
        <DeleteConfirm
          deckName={props.deck.name}
          deckId={props.deck.id}
          deleteFn={() => handleDelete(props.deck.id)}
          cancelFn={() => setDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
