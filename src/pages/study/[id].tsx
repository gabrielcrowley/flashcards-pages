import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useState } from "react";
import { Card } from "@prisma/client";
import Link from "next/link";

interface StudyProps {
  cards: Card[],
}

export default function StudyPage() {
  const router = useRouter();

  if (typeof router.query.id !== "string")
    throw new Error("ID is invalid or missing");

  const { data } = api.deck.getDeckById.useQuery({ id: router.query.id });

  if (!data) return <div>404: Not Found</div>

  return (
    <div className="mt-16 flex flex-col items-center">
      <div className="w-full rounded-md border border-white bg-slate-900 p-10 md:w-1/3">
        <Study cards={data.cards} />
      </div>
    </div>
  );
}

function Study(props: StudyProps) {
  const [cardQueue, setCardQueue] = useState(props.cards);
  const [showBack, setShowBack] = useState(false);

  function failCard() {
    setCardQueue(cardQueue.slice(1).concat(cardQueue[0]));
    setShowBack(false);
  }

  function passCard() {
    if(cardQueue.length == 1) {
      setCardQueue([]);
      return;
    }

    setCardQueue(cardQueue.slice(1));
    setShowBack(false);
  }

  if (cardQueue[0]) {
    return (
      <div>
        <p>{cardQueue[0].front}</p>
        <button
          className="my-2 p-2 rounded-md bg-blue-700 hover:bg-blue-900"
          onClick={() => setShowBack(!showBack)}
        >
          Show
        </button>
  
        {showBack && (
          <div>
            <p>{cardQueue[0].back}</p>
            <div className="flex gap-2">
              <button
                className="p-2 rounded-md bg-teal-700 hover:bg-teal-900"
                onClick={passCard}
              >
                Pass
              </button>
              <button
                className="p-2 rounded-md bg-red-700 hover:bg-red-900"
                onClick={failCard}
              >
                Fail
              </button>
            </div>
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div>
        <p>No cards remaining</p>
        <Link href={`/`}>Home</Link>
      </div>
    )
  }
  
}