import { useRouter } from "next/router";
import { api } from "@/utils/api";

export default function Study() {
  const router = useRouter();

  if (typeof router.query.id !== "string")
    throw new Error("ID is invalid or missing");

  const { data } = api.deck.getDeckById.useQuery({ id: router.query.id });

  return (
    <div className="mt-16 flex flex-col items-center">
      <div className="w-full rounded-md border border-white bg-slate-900 p-10 md:w-1/3">
        <p>{data?.name}</p>
      </div>
    </div>
  );
}
