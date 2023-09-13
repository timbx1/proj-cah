import React, { useState } from "react";
import PreGame from "./PreGame";
import JoinedGame from "./JoinedGame";
import InGame from "./InGame";
import PacksView from "./PacksView";
import CreateGame from "./CreateGame";
import './App.css';

function App() {
  // uinum: 0 = preGame; 1 = joinedGame; 2 = inGame 3 = packsview 4 = CreateGame
  const [uiNum, setuiNum] = useState(0);
  const [playerData, setplayerData] = useState()
  const [gameid, setgameid] = useState()

  //SOURCE: https://codepen.io/baarbaracrr/pen/KKovmGb
  const animatedBackground = (<div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
 </div>)

  const changeUi = (num,data,gameid) => {
    setuiNum(num)
    setplayerData(data)
    setgameid(gameid)
    
  }

  if (uiNum == 0){
  return (
    <div>
      {animatedBackground}
        <PreGame changeUi = {changeUi} pData={playerData} gId={gameid} />
        <p>{playerData}</p>
    </div>
    
    );
  }
  else if(uiNum == 1){
    return (
      <div>
        {animatedBackground}
        <JoinedGame changeUi = {changeUi} pData={playerData} gId={gameid} />
      </div>
    )
  }
  else if(uiNum == 2){
    return (
      <div>
        {animatedBackground}
        <InGame changeUi = {changeUi} pData={playerData} gId={gameid} />
      </div>
    )
  }
  else if(uiNum == 3){
    return (
      <div>
        {animatedBackground}
        <PacksView usePack={false} changeUi = {changeUi} pData={playerData} gId = {gameid} />
      </div>
    )
  }
  else if(uiNum == 4){
    return (
      <div>
        {animatedBackground}
        <CreateGame changeUi = {changeUi} pData={playerData}></CreateGame>
      </div>
    )
  }

}

export default App;
