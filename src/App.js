import React, { useState } from "react";
import PreGame from "./PreGame";
import JoinedGame from "./JoinedGame";
import InGame from "./InGame";
import PacksView from "./PacksView";
import CreateGame from "./CreateGame";


function App() {
  // uinum: 0 = preGame; 1 = joinedGame; 2 = inGame 3 = packsview 4 = CreateGame
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
        <PreGame changeUi = {changeUi} pData={playerData} gId={gameid} />
        <p>{playerData}</p>
    </div>
    
    );
  }
  else if(uiNum == 1){
    return (
      <div>
        <JoinedGame changeUi = {changeUi} pData={playerData} gId={gameid} />
      </div>
    )
  }
  else if(uiNum == 2){
    return (
      <div>
        <InGame changeUi = {changeUi} pData={playerData} gId={gameid} />
      </div>
    )
  }
  else if(uiNum == 3){
    return (
      <div>
        <PacksView usePack={false} changeUi = {changeUi} pData={playerData} gId = {gameid} />
      </div>
    )
  }
  else if(uiNum == 4){
    return (
      <div>
        <CreateGame changeUi = {changeUi} pData={playerData}></CreateGame>
      </div>
    )
  }

}

export default App;
