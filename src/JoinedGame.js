import React, { useState } from 'react'
import axios from 'axios'
import config from './config.json'


function JoinedGame(props) {
  const playerData = props.pData
  const gameid = props.gId
  const [players , setPlayers] = useState(["hi"])
  getGameData()
  function showPlayers(gameData){
    var players = gameData.games[gameid].players
    var pList = players.map((user) => (<div key={user.id}>{user.name}</div>))
    setPlayers(pList)
  }

  function getGameData (){
    
    axios.get(config.preUrl+'/games/').then(response => {
      showPlayers(response.data)
      
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