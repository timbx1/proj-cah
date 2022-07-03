import React, { useState } from 'react'
import axios from 'axios'
import config from './config.json'
import { hasSelectionSupport } from '@testing-library/user-event/dist/utils'

function JoinedGame(props) {
  const playerData = props.pData
  const gameid = props.gId
  const [players , setPlayers] = useState()
//thread? if game.running true ...
  function startGame (){

  }

  getGameData()
  function showPlayers(gameData){
    var index = 0;
    for(let i = 0; i < gameData.length; i++){
      if (gameData[i].id == gameid){
        index = i
      }
    }
    var players = gameData[index].players
    var pList = []
    pList.push(<p key={"p1"}> </p>)
    pList.push(players.map((user) => (<div key={user.id}>|  {user.name} </div>)))

    if (gameData[index].owner.id == playerData.id){
      pList.push(<p key={"p2"}> </p>)
      pList.push(<button key={"onlyowner"} onClick={startGame}>START GAME</button>)
    }
    else{
      pList.push(<p key={"p3"} style={{color:'red'}}>Wait for owner to Start Game</p>)
      setPlayers(pList)
      checkIfRunning(gameData[index])
    }

    setPlayers(pList)
    
  }

  function checkIfRunning (game){
    let running = false
    while(
      !running
    )
    {
      hasSelectionSupport(5000);
      axios.get(config.preUrl+'/games/').then(response => {
        console.log(running)
        running = response.data.games[gameid].running
        
      })
    }
    
  }

  function getGameData (){
    axios.get(config.preUrl+'/games/').then(response => {
      showPlayers(response.data.games)
      
    })

  }
  
  return (
    <div>
        <label>Players: </label>
        <button onClick={getGameData}>Refresh</button>
        <div>{players}</div>
    </div>
  )
}

export default JoinedGame