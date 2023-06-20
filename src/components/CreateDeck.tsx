import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { FormEvent, use, useState } from "react";

export function CreateDeck() {
  const [showDeckForm, setShowDeckForm] = useState(false);

  function hideNewDeck() {
    setShowDeckForm(false);
  }

  return (
    <div>
      <button
        className="rounded-md bg-blue-700 p-2 hover:bg-blue-900"
        onClick={() => setShowDeckForm(!showDeckForm)}
      >
        New Deck
      </button>
      {showDeckForm && <DeckForm hideFn={hideNewDeck} />}
    </div>
  );
}

function DeckForm(props: { hideFn: () => void }) {
  const [deckName, setDeckName] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const router = useRouter();
  const utils = api.useContext();
  const mutation = api.deck.createDeck.useMutation({
    onSuccess: () => {
      utils.deck.invalidate();
    },
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    props.hideFn();
    try {
      const deck = await mutation.mutateAsync({ name: deckName, desc: deckDesc });
      router.push(`/edit/${encodeURIComponent(deck.id)}`);
    }
    catch (error) {
      console.log("There was a problem loading the new deck.");
    }

  }

  return (
    <div className="absolute inset-x-1/3 rounded-md bg-slate-700 px-6 py-10 opacity-95">
      <p>{mutation.isSuccess ? "Deck Created." : null}</p>

      <h2 className="text-2xl font-bold">Create Deck</h2>

      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
        <input
          type="text"
          id="deckName"
          name="deckName"
          placeholder="Name"
          onChange={(e) => setDeckName(e.target.value)}
          className="rounded-md p-1 text-black"
        />
        <input
          type="text"
          id="deckDesc"
          name="deckDesc"
          placeholder="Description"
          onChange={(e) => setDeckDesc(e.target.value)}
          className="rounded-md p-1 text-black"
        />
        <div className="flex gap-2">
          <input
            type="submit"
            value="Submit"
            className="rounded-md bg-blue-700 p-2 hover:bg-blue-900"
          />
          <button
            onClick={props.hideFn}
            className="rounded-md bg-blue-700 p-2 hover:bg-blue-900"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
