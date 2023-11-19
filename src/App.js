import React, { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Stopwatch from "./Stopwatch";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [countRoll, setCountRoll] = useState(0);

  //With each change in the dice values, it should be checked whether the game should end or not
  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);

    //Checking whether all dice are held and if they all have the same value
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  //Generating new dice for the game
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  //Generating 10 dice with random values
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  //
  function rollDice() {
    //Generating new dice based on the tenzies (information about whether we are in the middle of a game or starting a new one)
    if (!tenzies) {
      //If the die is held, it should return the same die; if not, it should generate a new one
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );

      //Counter for new rolls
      setCountRoll((prevState) => prevState + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setCountRoll(0);
    }
  }

  //A function passed to the Die component; if the die is clicked, it should toggle the information about whether the die is held or not.
  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  //Generating as many dice as there are values in 'dice'
  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <div>
      {/* If we finish the game, confetti will appear */}
      {tenzies && <Confetti />}

      <main>
        <h1 className="title">Tenzies</h1>
        <h2>Click "Roll": {countRoll}</h2>
        <div>
          <Stopwatch stopStoper={tenzies} />
        </div>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice-container">{diceElements}</div>
        <button className="roll-dice" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </main>
    </div>
  );
}
