import React,{ useRef, useState, useContext } from 'react'
import axios from 'axios'
import config from './config.json'

function PreGame({changeUi},{pushPlayerData}) {
    const nameInRef = useRef()
    const [outPreGame, setOutPreGame] = useState("")
    

    function goToGame(playerdata,gameid){
        changeUi(1,playerdata,gameid)
        
    }

    function joinGame(gameid,playerdata){
       
        var Jstring = '{"player":'+ playerdata.id +',"action":"join"}'
        var msg = JSON.parse(Jstring)
        
        axios.patch(config.preUrl+'/games/' + gameid, msg).then(response => {
            goToGame(playerdata,gameid) 
        })  
        
    }
    function createGame(playerdata){
        var userid = playerdata.id
        var Jstring = '{"owner":'+userid+'}'
        var msg = JSON.parse(Jstring)
        axios.post(config.preUrl+'/games/',msg).then(response => {
            goToGame(playerdata,response.data.id)
        })
        
    }
    /*wenn spiel mit weniger als 4 leuten und !running dann 
    beitreten ansonsten spiel erstellen mit sich selbst als owner*/
    function scanGames (games, data){
        var send = false
        for(let i = 0; i < games.length-1;i++){
            if((games[i].players.length) < 3 && !(games[i].running)){
                joinGame(games[i].id,data)
                return
            }
            else{
                send = true
            }
        }
        if (send){
            createGame(data)
        }
    }
    //get games
    function searchGame(data){
        var games = []
        axios.get(config.preUrl+'/games/').then(response => {
            scanGames( response.data.games, data )
        })      
    }

    // wenn name nicht vergeben POST player
    function setName(inName, data){
        var send = false
        if (inName == ''){ setOutPreGame("NO NAME ENTERED")}
        else{ 
            
            for(let i = 0; i< data.length-1;i++){
                if (data[i].name == inName){
                    setOutPreGame("NAME ALLREADY TAKEN")
                    return 
                }
                else{
                    send = true
                }    
                
             }
            if (send){
                var Jstring = '{"name":' +'"' + inName + '"' + '}'
                var msg = JSON.parse(Jstring)
                axios.post(config.preUrl+'/players/', msg).then(response =>{
                    searchGame(response.data)
                })
            }
        }
        
        return
    }
    //get all players
    function handleSearch(e){
        const inName =nameInRef.current.value
        var players = []
        axios.get(config.preUrl+'/players/').then(response => {
            setName(inName, response.data.players)
        })

        return
    }

  return (
    <div>
        <div>
            <label>Enter Name: </label>
            <input ref={nameInRef} type="text"></input>
            <button onClick={handleSearch} >SEARCH GAME</button>
        </div>
        <div>
            <output style={{color: 'red'}}>{outPreGame}</output>
        </div>

    </div>
  )
}

export default PreGame
