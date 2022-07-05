import React,{ useRef, useState } from 'react'
import axios from 'axios'
import config from './config.json'
import Recycle_bin from './Recycle_bin'
import { Hilfe } from './Hilfe'

function PreGame({changeUi}) {
    const nameInRef = useRef()
    const [outPreGame, setOutPreGame] = useState("")

    function goToGame(playerdata,gameid){
        changeUi(1,playerdata,gameid)
        
    }

    function joinGame(gameid,playerdata){
        setOutPreGame(outPreGame+'.')
        var Jstring = '{"player":'+ playerdata.id +',"action":"join"}'
        var msg = JSON.parse(Jstring)
        
        axios.patch(config.preUrl+'/games/' + gameid + '/' + playerdata.id, msg).then(response => {
            
            goToGame(playerdata,gameid) 
        })  
        
    }
    function createGame(playerdata){
        setOutPreGame(outPreGame+'.')
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
        setOutPreGame(outPreGame+'.')
        
        var send = false
        if (!(games.length === 0)){
            for(let i = 0; i < games.length;i++){
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
        else{
            createGame(data)
        }
    }
    //get games
    function searchGame(data){
        setOutPreGame(outPreGame+'.')
        axios.get(config.preUrl+'/games/').then(response => {
            scanGames( response.data.games, data )
        })      
    }

    function postPlayers(inName){
        var Jstring = '{"name":' +'"' + inName + '"' + '}'
        var msg = JSON.parse(Jstring)
        axios.post(config.preUrl+'/players/', msg).then(response =>{
            searchGame(response.data)
        })
    }

    // wenn name nicht vergeben POST player
    function setName(inName, data){
        setOutPreGame(outPreGame+'.')
        var send = false
        if (inName == ''){ setOutPreGame("NO NAME ENTERED")}
        else{ 
            if(!(data.length === 0)){
                for(let i = 0; i< data.length;i++){
                    if (data[i].name == inName){
                        setOutPreGame("NAME ALLREADY TAKEN")
                        return 
                    }
                    else{
                        send = true
                    }    
                    
                }
                if (send){
                    postPlayers(inName)
                }
            }
            else{
                postPlayers(inName)
            }
        }
        
        return
    }
    //get all players
    function handleSearch(e){
        setOutPreGame("LOADING")
        const inName =nameInRef.current.value
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
            <Hilfe/>
            <Recycle_bin />
        </div>
        <div>
            <output style={{color: 'red'}}>{outPreGame}</output>
        </div>

    </div>
  )
}

export default PreGame
