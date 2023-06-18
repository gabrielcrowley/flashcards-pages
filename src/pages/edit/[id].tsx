import { useRouter } from "next/router";

export function EditDeck() {
  const router = useRouter();

  return (
    <div>
      <p>{router.query.id}</p>
    </div>
  )
}