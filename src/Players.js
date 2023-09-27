import React, { useState , useEffect} from "react";
import axios from "axios";
import config from './config.json'
const Players = (props) => {
    const playerData = props.pData
    const gameid = props.gId
    const [players , setPlayers] = useState()
    useEffect(()=>{
        getGameData()
      },[])
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
        setPlayers(pList)
    }
    function getGameData (){
        
        axios.get(config.preUrl+'games/').then(response => {
          console.log(response.data.games)
          showPlayers(response.data.games)
          
        }) 
    }
     
  return(
    <div>
        Players: 
        <div>{players}</div>
    </div>
  )
}

export default Players