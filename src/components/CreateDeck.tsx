import { api } from "@/utils/api";
import { FormEvent, use, useState } from "react"

export function CreateDeck() {
  const [showDeckForm, setShowDeckForm] = useState(false);

  function cancelNewDeck() {
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
      { showDeckForm && <DeckForm cancelFn={cancelNewDeck} /> }
    </div>
  )
}

function DeckForm(props: { cancelFn: () => void }) {
  const [deckName, setDeckName] = useState('');
  const [deckDesc, setDeckDesc] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Post deck to database
  }

  return (
    <div className="absolute inset-x-1/3 bg-slate-700 py-10 px-6 rounded-md opacity-95">

      <h2 className="text-2xl font-bold">Create Deck</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
        <input type="text" id="deckName" name="deckName" placeholder="Name"
          onChange={(e) => setDeckName(e.target.value)}
          className="p-1 rounded-md text-black"/>
        <input type="text" id="deckDesc" name="deckDesc" placeholder="Description"
          onChange={(e) => setDeckDesc(e.target.value)}
          className="p-1 rounded-md text-black"/>
        <div className="flex gap-2">
          <input type="submit" value="Submit" className="rounded-md bg-blue-700 p-2 hover:bg-blue-900" />
          <button onClick={props.cancelFn} className="rounded-md bg-blue-700 p-2 hover:bg-blue-900">Cancel</button>
        </div>
      </form>
    </div>
  )
}