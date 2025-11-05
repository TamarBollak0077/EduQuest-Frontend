// import React, { useState } from "react";
// import Modal from "./Modal";

// type CardType = "task" | "extra" | "lose";
// type TeamColor = "red" | "blue" | "green" | "";

// interface Card {
//   id: number;
//   type: CardType;
//   color: TeamColor;
//   revealed: boolean;
// }

// const generateCards = (): Card[] => {
//   const types: CardType[] = ["task", "extra", "lose"];
//   const cards: Card[] = [];
//   for (let i = 0; i < 30; i++) {
//     const type = types[Math.floor(Math.random() * types.length)];
//     cards.push({ id: i, type, color: "", revealed: false });
//   }
//   return cards;
// };

// const teams: TeamColor[] = ["red", "blue", "green"];

// function App() {
//   const [cards, setCards] = useState<Card[]>(generateCards());
//   const [currentTeam, setCurrentTeam] = useState<TeamColor>("");
//   const [modalMessage, setModalMessage] = useState<string>("");
//   const [modalOptions, setModalOptions] = useState<boolean>(false);
//   const [pendingCard, setPendingCard] = useState<Card | null>(null);
//   const [diceRolling, setDiceRolling] = useState<boolean>(false);

//   // פונקציה לנגינת צליל
//   const playSound = (type: "dice" | "click" | "success") => {
//     const audio = new Audio(`/sounds/${type}.mp3`);
//     audio.play();
//   };

//   // קוביית צבעים מונפשת
//   const rollDiceAnimated = () => {
//     setDiceRolling(true);
//     const colors: TeamColor[] = ["red", "blue", "green"];
//     let index = 0;
//     const interval = setInterval(() => {
//       setCurrentTeam(colors[index]);
//       index = (index + 1) % colors.length;
//     }, 100);

//     setTimeout(() => {
//       clearInterval(interval);
//       const chosen = colors[Math.floor(Math.random() * colors.length)];
//       setCurrentTeam(chosen);
//       setModalMessage(`תור של הקבוצה: ${chosen.toUpperCase()}`);
//       setDiceRolling(false);
//       playSound("dice");
//     }, 1200);
//   };

//   const handleCardClick = (card: Card) => {
//     if (!currentTeam) {
//       setModalMessage("הגרילו קובייה תחילה!");
//       return;
//     }
//     if (card.color) {
//       setModalMessage("קלף כבר נצבע!");
//       return;
//     }

//     // חשיפת סוג הקלף
//     if (!card.revealed) {
//       const newCards = cards.map((c) =>
//         c.id === card.id ? { ...c, revealed: true } : c
//       );
//       setCards(newCards);
//     }

//     playSound("click");

//     if (card.type === "task") {
//       setModalMessage("קיבלתם משימה!");
//       setModalOptions(true);
//       setPendingCard(card);
//     } else {
//       let message = card.type === "extra" ? "זכיתם בבחירה נוספת!" : "הפסדתם תור!";
//       setModalMessage(message);
//       if (card.type !== "lose") {
//         paintCard(card);
//         playSound("success");
//       } else {
//         setCurrentTeam("");
//       }
//     }
//   };

//   const paintCard = (card: Card) => {
//     const newCards = cards.map((c) =>
//       c.id === card.id ? { ...c, color: currentTeam } : c
//     );
//     setCards(newCards);
//     playSound("success");
//   };

//   const handleTaskSuccess = () => {
//     if (pendingCard) paintCard(pendingCard);
//     setModalOptions(false);
//     setPendingCard(null);
//     setCurrentTeam("");
//   };

//   const handleTaskFail = () => {
//     setModalOptions(false);
//     setPendingCard(null);
//     setCurrentTeam("");
//   };

//   const countCards = (color: TeamColor) =>
//     cards.filter((c) => c.color === color).length;

//   const remainingPaintableCards = cards.filter(
//     (c) => c.type !== "lose" && !c.color
//   );

//   const getWinner = () => {
//     const counts = teams.map((t) => ({ team: t, score: countCards(t) }));
//     counts.sort((a, b) => b.score - a.score);
//     return counts[0].score > 0 ? counts[0].team : "";
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-4xl font-bold text-center mb-6">משחק רמת שלמה</h1>

//       {/* קוביית צבעים מונפשת */}
//       <div className="flex justify-center mb-4">
//         <button
//           onClick={rollDiceAnimated}
//           disabled={diceRolling}
//           className={`bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition ${
//             diceRolling ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           להגריל קובייה
//         </button>
//       </div>

//       <p className="text-center mb-4 text-lg">
//         קבוצה נוכחית:{" "}
//         <span
//           className={`font-bold ${
//             currentTeam === "red"
//               ? "text-red-600"
//               : currentTeam === "blue"
//               ? "text-blue-600"
//               : currentTeam === "green"
//               ? "text-green-600"
//               : ""
//           }`}
//         >
//           {currentTeam.toUpperCase()}
//         </span>
//       </p>

//       {/* גריד קלפים */}
//       <div className="grid grid-cols-6 gap-4">
//         {cards.map((card) => (
//           <div
//             key={card.id}
//             onClick={() => handleCardClick(card)}
//             className={`h-36 flex items-center justify-center border-2 rounded-lg cursor-pointer shadow-lg transition transform hover:scale-105
//               ${card.color ? `bg-${card.color}-400 card-animated` : "bg-gray-300"}
//             `}
//           >
//             {card.revealed && (
//               <span className="font-bold text-white text-lg">
//                 {card.type.toUpperCase()}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* ניקוד */}
//       <div className="mt-6 text-center">
//         <h2 className="text-xl font-semibold mb-2">ניקוד</h2>
//         <p className="mb-1 text-red-600">אדום: {countCards("red")}</p>
//         <p className="mb-1 text-blue-600">כחול: {countCards("blue")}</p>
//         <p className="mb-1 text-green-600">ירוק: {countCards("green")}</p>
//       </div>

//       {/* הודעת ניצחון */}
//       {remainingPaintableCards.length === 0 && (
//         <h2 className="mt-6 text-3xl font-extrabold text-center text-purple-700 animate-pulse">
//           המשחק הסתיים! מנצחת הקבוצה: {getWinner().toUpperCase()}
//         </h2>
//       )}

//       {/* Modal */}
//       {modalMessage && (
//         <Modal
//           message={modalMessage}
//           showOptions={modalOptions}
//           onClose={() => setModalMessage("")}
//           onSuccess={handleTaskSuccess}
//           onFail={handleTaskFail}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import ModalSVG from "./ModalSVG";

type CardType = "task" | "extra" | "lose";
type TeamColor = "red" | "blue" | "green" | "";

interface Card {
  id: number;
  type: CardType;
  color: TeamColor;
  revealed: boolean;
}

const generateCards = (): Card[] => {
  const types: CardType[] = ["task", "extra", "lose"];
  const cards: Card[] = [];
  for (let i = 0; i < 30; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    cards.push({ id: i, type, color: "", revealed: false });
  }
  return cards;
};

const teams: TeamColor[] = ["red", "blue", "green"];

function App() {
  const [cards, setCards] = useState<Card[]>(generateCards());
  const [currentTeam, setCurrentTeam] = useState<TeamColor>("");
  const [pendingCard, setPendingCard] = useState<Card | null>(null);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalOptions, setModalOptions] = useState<boolean>(false);
  const [diceRolling, setDiceRolling] = useState<boolean>(false);

  const playSound = (type: "dice" | "click" | "success") => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play();
  };

  const rollDiceAnimated = () => {
    setDiceRolling(true);
    const colors: TeamColor[] = ["red", "blue", "green"];
    let index = 0;
    const interval = setInterval(() => {
      setCurrentTeam(colors[index]);
      index = (index + 1) % colors.length;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const chosen = colors[Math.floor(Math.random() * colors.length)];
      setCurrentTeam(chosen);
      setModalMessage(`תור של הקבוצה: ${chosen.toUpperCase()}`);
      setDiceRolling(false);
      playSound("dice");
    }, 1200);
  };

  const handleCardClick = (card: Card) => {
    if (!currentTeam) {
      setModalMessage("הגרילו קובייה תחילה!");
      return;
    }
    if (card.color) {
      setModalMessage("קלף כבר נצבע!");
      return;
    }

    if (!card.revealed) {
      const newCards = cards.map((c) =>
        c.id === card.id ? { ...c, revealed: true } : c
      );
      setCards(newCards);
    }

    playSound("click");

    if (card.type === "task") {
      setModalMessage("קיבלתם משימה!");
      setModalOptions(true);
      setPendingCard(card);
    } else {
      let message = card.type === "extra" ? "זכיתם בבחירה נוספת!" : "הפסדתם תור!";
      setModalMessage(message);
      if (card.type !== "lose") {
        paintCard(card);
        playSound("success");
      } else {
        setCurrentTeam("");
      }
      setPendingCard(card);
      setModalOptions(false);
    }
  };

  const paintCard = (card: Card) => {
    const newCards = cards.map((c) =>
      c.id === card.id ? { ...c, color: currentTeam } : c
    );
    setCards(newCards);
    playSound("success");
  };

  const handleTaskSuccess = () => {
    if (pendingCard) paintCard(pendingCard);
    setPendingCard(null);
    setModalOptions(false);
    setCurrentTeam("");
    setModalMessage("");
  };

  const handleTaskFail = () => {
    setPendingCard(null);
    setModalOptions(false);
    setCurrentTeam("");
    setModalMessage("");
  };

  const countCards = (color: TeamColor) =>
    cards.filter((c) => c.color === color).length;

  const remainingPaintableCards = cards.filter(
    (c) => c.type !== "lose" && !c.color
  );

  const getWinner = () => {
    const counts = teams.map((t) => ({ team: t, score: countCards(t) }));
    counts.sort((a, b) => b.score - a.score);
    return counts[0].score > 0 ? counts[0].team : "";
  };

  return (
    <div
      className="p-6 min-h-screen bg-no-repeat bg-cover relative"
      style={{ backgroundImage: "url(/assets/background.svg)" }}
    >
      {/* overlay קל למראה טוב */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div> */}

      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-center mb-6 text-black">
          משחק רמת שלמה
        </h1>

        {/* קוביית צבעים */}
        <div className="flex justify-center mb-4">
          <button
            onClick={rollDiceAnimated}
            disabled={diceRolling}
            className={`bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition ${
              diceRolling ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            להגריל קובייה
          </button>
        </div>

        <p className="text-center mb-4 text-lg text-black">
          קבוצה נוכחית:{" "}
          <span
            className={`font-bold ${
              currentTeam === "red"
                ? "text-red-600"
                : currentTeam === "blue"
                ? "text-blue-600"
                : currentTeam === "green"
                ? "text-green-600"
                : ""
            }`}
          >
            {currentTeam.toUpperCase()}
          </span>
        </p>

        {/* גריד קלפים */}
        <div className="grid grid-cols-6 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`h-36 flex items-center justify-center border-2 rounded-lg cursor-pointer shadow-lg transition transform hover:scale-105
              ${card.color ? `bg-${card.color}-400 card-animated` : "bg-gray-300"}
            `}
            >
              {card.revealed && (
                <span className="font-bold text-white text-lg">
                  {card.type.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ניקוד */}
        <div className="mt-6 text-center text-white">
          <h2 className="text-xl font-semibold mb-2">ניקוד</h2>
          <p className="mb-1 text-red-600">אדום: {countCards("red")}</p>
          <p className="mb-1 text-blue-600">כחול: {countCards("blue")}</p>
          <p className="mb-1 text-green-600">ירוק: {countCards("green")}</p>
        </div>

        {/* הודעת ניצחון */}
        {remainingPaintableCards.length === 0 && (
          <h2 className="mt-6 text-3xl font-extrabold text-center text-black-700 animate-pulse">
            המשחק הסתיים! מנצחת הקבוצה: {getWinner().toUpperCase()}
          </h2>
        )}

        {/* ModalSVG */}
        {pendingCard && (
          <ModalSVG
            svgPath={`/assets/${pendingCard.type}.svg`}
            onClose={handleTaskFail}
            onSuccess={handleTaskSuccess}
            onFail={handleTaskFail}
            showOptions={modalOptions}
          />
        )}
      </div>
    </div>
  );
}

export default App;


