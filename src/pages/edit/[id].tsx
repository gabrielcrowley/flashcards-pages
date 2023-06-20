import { api } from "@/utils/api";
import Link from "next/link";
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
      <Link href={`/`} className="rounded-md bg-blue-700 p-2 hover:bg-blue-900">
        Home
      </Link>
    </div>
  );
}
