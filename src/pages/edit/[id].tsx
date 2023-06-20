import { api } from "@/utils/api";
import { useRouter } from "next/router";

export default function EditDeck() {
  const router = useRouter();

  if (typeof router.query.id !== "string") {
    throw new Error("ID is invalid or missing");
  }

  const deck = api.deck.getDeckById.useQuery({ id: router.query.id });

  return (
    <div>
      <p>{router.query.id}</p>
      <p>{deck.data?.name}</p>
    </div>
  );
}
