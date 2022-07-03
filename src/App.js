import React, { useState } from "react";
import PreGame from "./PreGame";
import JoinedGame from "./JoinedGame";

function App() {
  // uinum: 0 = preGame; 1 = joinedGame
  const [uiNum, setuiNum] = useState(0);
  const [playerData, setplayerData] = useState()
  const [gameid, setgameid] = useState()

  const changeUi = (num,data,gameid) => {
    setuiNum(num)
    setplayerData(data)
    setgameid(gameid)
    
  }

  if (uiNum == 0){
  return (
    <div>
        <PreGame changeUi = {changeUi} />
        <p>{playerData}</p>
    </div>
    
    );
  }
  else{
    return (
      <div>
        <JoinedGame changeUi = {changeUi} pData={playerData} gId={gameid} />
      </div>
    )
  }
}

export default App;
