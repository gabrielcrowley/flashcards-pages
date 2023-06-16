import { api } from "@/utils/api";

interface DeckEntryProps {
  name: string;
  description: string;
}

function DeckEntry(props: DeckEntryProps) {
  return (
    <div className="mt-2 rounded-md border p-2">
      <h2 className="text-2xl">{props.name}</h2>
      <p>{props.description}</p>
    </div>
  );
}

export default function DeckList() {
  const { data } = api.deck.getAll.useQuery();

  return (
    <div className="mt-2">
      {data?.map((deck) => (
        <DeckEntry
          key={deck.id}
          name={deck.name}
          description={deck.description}
        />
      ))}
    </div>
  );
}
