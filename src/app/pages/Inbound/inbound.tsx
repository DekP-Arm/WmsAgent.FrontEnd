"use client";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  DragEvent,
  FormEvent,
} from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";

export function Inbound() {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
}

const Board = () => {
  const [cards, setCards] = useState<CardType[]>(DEFAULT_CARDS);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Incoming order"
        column="Incoming order"
        headingColor="text-white-500"
        cards={cards}
        setCards={setCards}
        onCardClick={handleCardClick}
      />
      <Column
        title="Checking"
        column="Checking"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
        onCardClick={handleCardClick}
      />
      <Column
        title="Reject"
        column="Reject"
        headingColor="text-red-200"
        cards={cards}
        setCards={setCards}
        onCardClick={handleCardClick}
      />
      <Column
        title="Approve"
        column="Approve"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
        onCardClick={handleCardClick}
      />
      <BurnBarrel setCards={setCards} />
      {selectedCard && (
        <Modal card={selectedCard} onClose={handleCloseModal} />
      )}
    </div>
  );
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
  onCardClick: (card: CardType) => void;
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
  onCardClick,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column}"]`
      ) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => (
          <Card
            key={c.id}
            {...c}
            handleDragStart={handleDragStart}
            onCardClick={onCardClick}
          />
        ))}
        <DropIndicator beforeId={null} column={column} />
        {column === "Incoming order" && (
          <AddCard column={column} setCards={setCards} />
        )}
      </div>
    </div>
  );
};

type CardProps = CardType & {
  handleDragStart: (e: DragEvent, card: CardType) => void;
  onCardClick: (card: CardType) => void;
};

const Card = ({
  title,
  id,
  column,
  description,
  handleDragStart,
  onCardClick,
}: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column, description })}
        onClick={() => onCardClick({ title, id, column, description })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({
  setCards,
}: {
  setCards: Dispatch<SetStateAction<CardType[]>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

type AddCardProps = {
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() !== "" && description.trim() !== "") {
      setCards((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          title: text,
          description: description,
          column,
        },
      ]);
      setText("");
      setDescription("");
      setShowForm(false);
    }
  };

  return (
    <>
      {!showForm ? (
        <div
          onClick={() => setShowForm(true)}
          className="flex h-16 w-full cursor-pointer items-center justify-center rounded border border-neutral-700 text-neutral-500 hover:bg-neutral-800"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          <p className="text-sm">Add card</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-2"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded border border-neutral-700 bg-neutral-800 p-2 text-neutral-100"
            placeholder="Card title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded border border-neutral-700 bg-neutral-800 p-2 text-neutral-100"
            placeholder="Card description"
          />
          <button
            type="submit"
            className="rounded bg-green-600 px-3 py-1 text-neutral-50"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="rounded border border-neutral-700 px-3 py-1 text-neutral-400"
          >
            Cancel
          </button>
        </form>
      )}
    </>
  );
};

type ModalProps = {
  card: CardType;
  onClose: () => void;
};

const Modal = ({ card, onClose }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-neutral-900 bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="bg-neutral-800 p-6 rounded w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-neutral-50">{card.title}</h2>
        <p className="text-neutral-300">Column: {card.column}</p>
        <p className="text-neutral-300 mt-2">Description: {card.description}</p>
        <button
          onClick={onClose}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-neutral-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Define CardType and DEFAULT_CARDS here

type CardType = {
  id: string;
  title: string;
  description: string;
  column: ColumnType;
};

type ColumnType = "Incoming order" | "Checking" | "Reject" | "Approve";

const DEFAULT_CARDS: CardType[] = [
  {
    id: "1",
    title: "Order A109",
    description: "Oishi x3, Singha x2",
    column: "Incoming order",
  },
  {
    id: "2",
    title: "Order A108",
    description: "Oishi x3, Singha x2",
    column: "Checking",
  },
  {
    id: "3",
    title: "Order A107",
    description: "Oishi x3, Singha x2",
    column: "Reject",
  },
  {
    id: "4",
    title: "Order A106",
    description: "Oishi x3, Singha x2",
    column: "Approve",
  },
];
