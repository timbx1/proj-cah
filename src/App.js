import React, { useState } from "react";
import PreGame from "./PreGame";
import JoinedGame from "./JoinedGame";
import InGame from "./InGame";
import PacksView from "./PacksView";
import CreateGame from "./CreateGame";
import './App.css';

function App() {
  // uiNum: 0 = PreGame; 1 = JoinedGame; 2 = InGame; 3 = PacksView; 4 = CreateGame
  const [uiNum, setUiNum] = useState(0);
  const [playerData, setPlayerData] = useState(null);
  const [gameId, setGameId] = useState(null);

  // Die animierte Hintergrund-Komponente
  const animatedBackground = (
    <div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
  );

  // Funktion zum Ändern des UI-Zustands und Aktualisieren der Spielerdaten und der Spiel-ID
  const changeUi = (num, data, gameId) => {
    setUiNum(num);
    setPlayerData(data);
    setGameId(gameId);
  }

  // Prüfen, welcher UI-Zustand aktuell ist und die entsprechende Komponente rendern
  if (uiNum === 0) {
    return (
      <div>
        {animatedBackground}
        {/* PreGame-Komponente mit UI-Wechsel-Funktion und Spielerdaten */}
        <PreGame changeUi={changeUi} pData={playerData} gId={gameId} />
        <p>{playerData}</p>
      </div>
    );
  } else if (uiNum === 1) {
    return (
      <div>
        {animatedBackground}
        {/* JoinedGame-Komponente mit UI-Wechsel-Funktion und Spielerdaten */}
        <JoinedGame changeUi={changeUi} pData={playerData} gId={gameId} />
      </div>
    );
  } else if (uiNum === 2) {
    return (
      <div>
        {animatedBackground}
        {/* InGame-Komponente mit UI-Wechsel-Funktion und Spielerdaten */}
        <InGame changeUi={changeUi} pData={playerData} gId={gameId} />
      </div>
    );
  } else if (uiNum === 3) {
    return (
      <div>
        {animatedBackground}
        {/* PacksView-Komponente mit UI-Wechsel-Funktion und Spielerdaten */}
        <PacksView usePack={false} changeUi={changeUi} pData={playerData} gId={gameId} />
      </div>
    );
  } else if (uiNum === 4) {
    return (
      <div>
        {animatedBackground}
        {/* CreateGame-Komponente mit UI-Wechsel-Funktion und Spielerdaten */}
        <CreateGame changeUi={changeUi} pData={playerData}></CreateGame>
      </div>
    );
  }
}

export default App;
