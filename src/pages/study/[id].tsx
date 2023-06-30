import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useState } from "react";
import { Card } from "@prisma/client";
import Link from "next/link";
import { PageLayout } from "@/components/layout";

interface StudyProps {
  cards: Card[];
}

export default function StudyPage() {
  const router = useRouter();

  if (typeof router.query.id !== "string") {
    throw new Error("ID is invalid or missing");
  }

  const { data } = api.deck.getDeckById.useQuery({ id: router.query.id });

  if (!data) return <div>404: Not Found</div>;

  return (
    <main className="flex h-screen flex-col items-center">
      <Study cards={data.cards} />
    </main>
  );
}

function Study(props: { cards: Card[] }) {
  const [cardQueue, setCardQueue] = useState(props.cards);
  const [revealed, setRevealed] = useState(false);

  function passCard() {
    if (cardQueue.length == 1) {
      setCardQueue([]);
      return;
    }

    setCardQueue(cardQueue.slice(1));
    setRevealed(false);
  }

  function failCard() {
    setCardQueue(cardQueue.slice(1).concat(cardQueue[0]));
    setRevealed(false);
  }

  if (!cardQueue[0]) {
    return <StudyComplete />;
  }

  return (
    <div className="md:h flex h-full w-full flex-col justify-between bg-slate-800 p-16 text-2xl md:mt-36 md:h-fit md:max-w-2xl">
      <div className="flex flex-col gap-4">
        <p className="self-end text-base opacity-60">
          {cardQueue.length} remaining
        </p>
        <p className="text-center">{cardQueue[0].front}</p>
      </div>

      {revealed ? (
        <StudyBack
          cardBack={cardQueue[0].back}
          passFn={passCard}
          failFn={failCard}
        />
      ) : (
        <button
          className="rounded-sm bg-blue-700 p-5 hover:bg-blue-900 md:mt-20"
          onClick={() => setRevealed(true)}
        >
          Show
        </button>
      )}
    </div>
  );
}

function StudyComplete() {
  return (
    <div className="md:h flex h-full w-full flex-col justify-between bg-slate-800 p-16 text-2xl md:mt-36 md:h-fit md:max-w-2xl">
      <p>No cards remaining</p>
      <Link
        href={`/`}
        className="rounded-sm bg-blue-700 p-5 text-center hover:bg-blue-900 md:mt-20"
      >
        Home
      </Link>
    </div>
  );
}

function StudyBack(props: {
  cardBack: string;
  passFn: () => void;
  failFn: () => void;
}) {
  return (
    <div className="flex flex-col md:mt-28">
      <div className="self-center">
        <p>{props.cardBack}</p>
      </div>
      <GradingOptions passFn={props.passFn} failFn={props.failFn} />
    </div>
  );
}

function GradingOptions(props: { passFn: () => void; failFn: () => void }) {
  return (
    <div className="mt-48 flex gap-8 md:mt-20">
      <button
        onClick={props.passFn}
        className="grow rounded-sm bg-teal-700 p-5 hover:bg-teal-900"
      >
        Pass
      </button>
      <button
        onClick={props.failFn}
        className="grow rounded-sm bg-rose-700 p-5 hover:bg-rose-900"
      >
        Fail
      </button>
    </div>
  );
}
