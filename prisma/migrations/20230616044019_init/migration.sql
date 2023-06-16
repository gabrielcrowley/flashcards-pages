-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "frontFields" TEXT[],
    "backFields" TEXT[],
    "deckId" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deck" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
