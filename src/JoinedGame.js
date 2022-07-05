import React, { Component, useState, useEffect } from 'react'
import axios from 'axios'
import config from './config.json'
import { Status } from './Status'
import { Hilfe } from './Hilfe'

function JoinedGame(props) {
  const playerData = props.pData
  const gameid = props.gId
  const [players , setPlayers] = useState()
  const [buttonRefresh , setRefresh] = useState("Refresh")

  useEffect(()=>{
    getGameData()
  },[])

  function goToGame(){
    props.changeUi(2,playerData,gameid)
  }

  function startGame (){
    console.log("start")
    let Jstring = '{"player":'+playerData.id+',"action":"start"}' 
    let msg = JSON.parse(Jstring)
    axios.patch(config.preUrl+'/games/'+gameid+'/'+playerData.id,msg).then(response => {
      goToGame()
    })
  }
  function checkIfRunning (game, index){
    axios.get(config.preUrl+'/games/').then(response => {
      
      if(!response.data.games[index].running){
        setTimeout(checkIfRunning(game ,index), 5000) 
      }
      else{
        goToGame()
      }
      
    }) 
    
  }


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
      setPlayers(pList)
    }
    else{
      pList.push(<p key={"p3"} style={{color:'red'}}>Wait for owner to Start Game</p>)
      setPlayers(pList)
      checkIfRunning(gameData[index],index)
    }

    
    
  }



  function getGameData (){
    setRefresh("Refresh")
    axios.get(config.preUrl+'/games/').then(response => {
      console.log(response.data.games)
      showPlayers(response.data.games)
      
    })

  }
  
  
  return (
    <div>
        <script type="text/javascript">document.getElementById("reload").click();</script>
        <label>Players: </label>
        <button onClick={getGameData} id ="reload">{buttonRefresh}</button>
        <Hilfe/>
        <Status gId = {gameid} />
        <div>{players}</div>
    </div>
  )
}

export default JoinedGame