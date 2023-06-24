import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
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

      {data.cards && <CardView cards={data.cards} deckId={data.id} />}
    </PageLayout>
  );
}

function CardView(props: { cards: Card[]; deckId: string }) {
  const [editMode, setEditMode] = useState(false);
  const [addCardForm, setAddCardForm] = useState(false);

  function hideNewCard() {
    setAddCardForm(false);
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-4 p-4">
        {!editMode && (
          <button
            onClick={() => setAddCardForm(!addCardForm)}
            className="rounded-sm bg-blue-700 p-2 hover:bg-blue-900"
          >
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
            {editMode ? "Finish Editing" : "Edit Deck"}
          </button>
        )}
      </div>

      <div className="flex border-b p-4">
        <p className="basis-5/12">
          <strong>Front</strong>
        </p>
        <p className="basis-5/12">
          <strong>Back</strong>
        </p>
      </div>

      <CardList cards={props.cards} editMode={editMode} />

      {addCardForm && (
        <AddCardForm hideFn={hideNewCard} deckId={props.deckId} />
      )}
    </div>
  );
}

function CardList(props: { cards: Card[]; editMode: boolean }) {
  const [editCardForm, setEditCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(0);
  const utils = api.useContext();
  const mutation = api.card.deleteCard.useMutation({
    onSuccess: () => {
      utils.deck.getDeckById.invalidate();
    },
  });

  function handleDelete(cardId: string) {
    mutation.mutate({ id: cardId });
  }

  return (
    <div>
      {props.cards &&
        props.cards.map((card, index) => (
          <div key={card.id} className="flex border-b p-4">
            <div className="basis-5/12">{card.front}</div>
            <div className="basis-5/12">{card.back}</div>
            {props.editMode && (
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEditingCard(index);
                    setEditCardForm(true);
                  }}
                  className="self-start rounded-sm bg-blue-700 px-2 hover:bg-blue-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="self-start rounded-sm bg-rose-700 px-2 hover:bg-rose-900"
                >
                  X
                </button>
              </div>
            )}
            {editCardForm && (
              <EditCardForm
                hideFn={() => setEditCardForm(false)}
                card={props.cards[editingCard]}
              />
            )}
          </div>
        ))}
    </div>
  );
}

function AddCardForm(props: { hideFn: () => void; deckId: string }) {
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const utils = api.useContext();
  const mutation = api.card.createCard.useMutation({
    onSuccess: () => {
      utils.deck.getDeckById.invalidate();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    props.hideFn();

    mutation.mutate({
      front: cardFront,
      back: cardBack,
      deckId: props.deckId,
    });
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-50 mx-1 mb-24 rounded-sm bg-slate-700 px-6 py-12 md:bottom-auto md:top-1/4 md:mx-auto md:max-w-md">
      <h2 className="text-2xl font-bold">Add Card</h2>

      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
        <input
          autoFocus
          type="text"
          id="cardFront"
          name="cardFront"
          placeholder="Front"
          autoComplete="off"
          onChange={(e) => setCardFront(e.target.value)}
          className="rounded-sm p-1 text-black"
        />

        <input
          type="text"
          id="cardBack"
          name="cardBack"
          placeholder="Back"
          autoComplete="off"
          onChange={(e) => setCardBack(e.target.value)}
          className="rounded-sm p-1 text-black"
        />

        <div className="flex gap-2">
          <input
            type="submit"
            value="Submit"
            className="cursor-pointer rounded-sm bg-blue-700 p-2 hover:bg-blue-900"
          />
          <button
            onClick={props.hideFn}
            className="rounded-sm bg-rose-700 p-2 hover:bg-rose-900"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function EditCardForm(props: { hideFn: () => void; card: Card }) {
  const [cardFront, setCardFront] = useState(props.card.front);
  const [cardBack, setCardBack] = useState(props.card.back);
  const utils = api.useContext();
  const mutation = api.card.editCard.useMutation({
    onSuccess: () => {
      utils.deck.getDeckById.invalidate();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    props.hideFn();

    mutation.mutate({
      front: cardFront,
      back: cardBack,
      cardId: props.card.id,
    });
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-50 mx-1 mb-24 rounded-sm bg-slate-700 px-6 py-12 md:bottom-auto md:top-1/4 md:mx-auto md:max-w-md">
      <h2 className="text-2xl font-bold">Edit Card</h2>

      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
        <input
          autoFocus
          autoComplete="off"
          type="text"
          id="cardFront"
          name="cardFront"
          value={cardFront}
          placeholder="Front"
          onChange={(e) => setCardFront(e.target.value)}
          className="rounded-sm p-1 text-black"
        />

        <input
          type="text"
          id="cardBack"
          name="cardBack"
          value={cardBack}
          placeholder="Back"
          onChange={(e) => setCardBack(e.target.value)}
          className="rounded-sm p-1 text-black"
        />

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
      </form>
    </div>
  );
}
