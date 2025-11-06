import React, { useState, useEffect } from "react";
import Modal from "./Modal";

type CardType = "task" | "extra" | "lose";
type TeamColor = "pink" | "orange" | "purple" | "";

interface Card {
  id: number;
  type: CardType;
  color: TeamColor;
  revealed: boolean;
}

const colorClasses: Record<TeamColor, string> = {
  pink: "bg-pink-400",
  orange: "bg-orange-400",
  purple: "bg-purple-400",
  "": "bg-gray-300"
};

const teams: TeamColor[] = ["pink", "orange", "purple"];

const generateCards = (): Card[] => {
  const totalCards = 30;
  const maxLose = Math.floor(totalCards * 0.25); // עד 25%
  let loseCount = 0;
  const cards: Card[] = [];

  for (let i = 0; i < totalCards; i++) {
    let type: CardType;
    const rand = Math.random();
    if (rand < 0.25 && loseCount < maxLose) {
      type = "lose";
      loseCount++;
    } else {
      type = rand < 0.625 ? "task" : "extra";
    }
    cards.push({ id: i, type, color: "", revealed: false });
  }

  // ערבוב קלפים
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

function App() {
  const [cards, setCards] = useState<Card[]>(generateCards());
  const [currentTeam, setCurrentTeam] = useState<TeamColor>("");
  const [diceRolling, setDiceRolling] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [bonusActive, setBonusActive] = useState<boolean>(false);
  const [bonusCardId, setBonusCardId] = useState<number | null>(null);
  const [turnQueue, setTurnQueue] = useState<TeamColor[]>([]);

  const playSound = (type: "dice" | "click" | "success") => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play();
  };

  const rollDiceAnimated = () => {
    setDiceRolling(true);
    let queue = [...turnQueue];
    if (queue.length === 0) {
      queue = [...teams].sort(() => Math.random() - 0.5);
      setTurnQueue(queue);
    }

    let index = 0;
    const interval = setInterval(() => {
      setCurrentTeam(queue[index]);
      index = (index + 1) % queue.length;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const chosen = queue.shift()!;
      setCurrentTeam(chosen);
      setTurnQueue(queue);
      setDiceRolling(false);
      playSound("dice");
    }, 1200);
  };

  const paintCard = (card: Card, isBonusSecondClick: boolean = false) => {
    setCards(cards.map(c => {
      if (c.id !== card.id) return c;
      if (card.type === "lose" && !isBonusSecondClick) {
        // קלף הפסד רגיל: לא צבע, רק revealed
        return { ...c, revealed: true };
      } else {
        // כל שאר המקרים: צובע
        return { ...c, color: currentTeam, revealed: true };
      }
    }));
    playSound("success");
  };

  const handleCardClick = (card: Card) => {
    if (!currentTeam || card.revealed) return;

    playSound("click");

    const isBonusSecondClick = bonusActive && card.id !== bonusCardId;

    if (isBonusSecondClick) {
      paintCard(card, true); // צובע בלי פופ-אפ, לא משנה סוגו
      setBonusActive(false);
      setBonusCardId(null);
      setCurrentTeam("");
      return;
    }

    switch (card.type) {
      case "lose":
        paintCard(card); // revealed, לא צבע
        setModalMessage("קלף הפסד – הפסדתם תור!");
        setCurrentTeam("");
        break;
      case "task":
        paintCard(card);
        setModalMessage("קיבלתם משימה!");
        setCurrentTeam("");
        break;
      case "extra":
        paintCard(card);
        setModalMessage("בונוס! בחרו קלף נוסף");
        setBonusActive(true);
        setBonusCardId(card.id);
        break;
    }
  };

  const countCards = (color: TeamColor) => cards.filter(c => c.color === color).length;
  const getWinner = () => {
    const counts = teams.map(t => ({ team: t, score: countCards(t) }));
    counts.sort((a, b) => b.score - a.score);
    return counts[0].score > 0 ? counts[0].team : "";
  };

  useEffect(() => {
    const allClicked = cards.every(c => c.revealed || c.type === "lose");
    if (allClicked && cards.length > 0) {
      setModalMessage(`המשחק הסתיים! מנצחת הקבוצה: ${getWinner().toUpperCase()}`);
      setCurrentTeam("");
      setBonusActive(false);
      setBonusCardId(null);
    }
  }, [cards]);

  // פונקציה לקביעת אנימציות לכל קלף לפי סוגו ומצבו
  const getCardAnimation = (
    card: Card,
    isBonusCard: boolean,
    isBonusSecondClick: boolean,
    gameFinished: boolean
  ) => {
    if (gameFinished) {
      const delay = (Math.random() * 0.5).toFixed(2); // delay אקראי 0–0.5s
      return `animate-bounce-finish` + ` style={{ animationDelay: '${delay}s' }}`;
      // ב-React נשים את זה ישירות כ-style
    }

    if (isBonusCard) return "animate-bonus";
    if (isBonusSecondClick) return "animate-color-pulse";
    if (card.type === "task" && card.revealed) return "animate-task";
    if (card.type === "lose" && card.revealed) return "animate-lose";

    // קלפים צבועים בלבד
    if (card.color !== "") return "animate-color-pulse";

    return "";
  };





  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6">משחק רמת שלמה</h1>

      {/* קוביית צבעים */}
      <div className="flex justify-center mb-4">
        <button
          onClick={rollDiceAnimated}
          disabled={diceRolling}
          className={`bg-gradient-to-r from-pink-400 via-orange-400 to-purple-400 text-white px-6 py-3 rounded shadow hover:scale-105 transition ${diceRolling ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          להגריל קובייה
        </button>
      </div>

      <p className="text-center mb-4 text-lg">
        קבוצה נוכחית:{" "}
        <span className={`font-bold ${currentTeam === "pink" ? "text-pink-600" : currentTeam === "orange" ? "text-orange-600" : currentTeam === "purple" ? "text-purple-600" : ""}`}>
          {currentTeam.toUpperCase()}
        </span>
      </p>
      {/* גריד קלפים */}
      <div className="grid grid-cols-6 gap-4">
        {cards.map(card => {
          const isBonusCard = bonusCardId === card.id;
          const isBonusSecondClick = bonusActive && card.revealed && card.color !== "";
          const gameFinished = cards.every(c => c.revealed || c.type === "lose");

          // delay אקראי רק בסוף המשחק
          const finishDelay = gameFinished ? `${(Math.random() * 0.5).toFixed(2)}s` : undefined;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`h-36 flex items-center justify-center border-2 rounded-lg cursor-pointer shadow-lg 
        hover:scale-110 hover:shadow-xl 
        ${colorClasses[card.color]} 
        ${getCardAnimation(card, isBonusCard, isBonusSecondClick, gameFinished)}
      `}
              style={finishDelay ? { animationDelay: finishDelay } : undefined}
            >
              {card.revealed && card.type === "lose" && !(isBonusSecondClick) && (
                <span className="font-bold text-white text-lg">קלף הפסד</span>
              )}
            </div>
          );
        })}

      </div>

      {/* ניקוד */}
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold mb-2">ניקוד</h2>
        <p className="mb-1 text-pink-600">ורוד: {countCards("pink")}</p>
        <p className="mb-1 text-orange-600">כתום: {countCards("orange")}</p>
        <p className="mb-1 text-purple-600">סגול: {countCards("purple")}</p>
      </div>

      {/* Modal */}
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage("")} />}
    </div>
  );
}

export default App;
