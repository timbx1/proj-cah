import React,{ useRef, useState } from 'react'
import axios from 'axios'
import config from './config.json'
import Recycle_bin from './Recycle_bin'
import { Hilfe } from './Hilfe'
import Game from './Game'

function PreGame({changeUi, pData, gId}) {
    const nameInRef = useRef()
    const [outPreGame, setOutPreGame] = useState("")

    const [games, setGames] = useState()

    function goToGame(num,playerdata,gameid){
        console.log('gotogame')
        changeUi(num,playerdata,gameid)
        
    }
    //join game with given id
    function joinGame(gameid,playerdata){
        setOutPreGame(outPreGame+'.')
        var Jstring = '{"action":"join"}'
        var msg = JSON.parse(Jstring)
        
        axios.patch(config.preUrl+'games/' + gameid + '/' + playerdata.id, msg).then(response => {
            
            goToGame(1,playerdata,gameid) 
        })  
        
    }
    //create a game
    function createGame(playerdata){
        setOutPreGame(outPreGame+'.')
        var userid = playerdata.id
        //packs und goal einstellen #########
        var Jstring = '{"owner":'+userid+'}'
        var msg = JSON.parse(Jstring)
        axios.post(config.preUrl+'games/',msg).then(response => {
            
            goToGame(1,playerdata,response.data.id)
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
    function mapGames (gameArr) {
        let pList = []
        pList.push(gameArr.map((eintrag) => (
        <div>
            <p> </p>
            <Game gId={eintrag.id} owner = {eintrag.owner} goal = {eintrag.goal} packs ={eintrag.packs} player = {eintrag.players}></Game>
        </div>
        )))
        setGames(pList)
    }
    //get games
    function searchGame(data){
        setOutPreGame(outPreGame+'.')
        axios.get(config.preUrl+'games/').then(response => {
            console.log(response.data.games)
            scanGames( response.data.games, data )
            mapGames(response.data.games)
        })      
    }

    function postPlayers(inName){
        var Jstring = '{"name":' +'"' + inName + '"' + '}'
        var msg = JSON.parse(Jstring)
        axios.post(config.preUrl+'players/', msg).then(response =>{
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
        axios.get(config.preUrl+'players/').then(response => {
            setName(inName, response.data.players)
        })

        return
    }
    function handleViewPacks(){
        goToGame(3,gId,pData)
    }
  return (
    <div>
        <div>
            <label>Enter Name: </label>
            <input ref={nameInRef} type="text"></input>
            <button onClick={handleSearch} >SEARCH GAME</button>
            <button onClick={handleViewPacks}>View Packs</button>
            <Hilfe/>
            <Recycle_bin />
        </div>
        <div>
            <output style={{color: 'red'}}>{outPreGame}</output>
        </div>
        <div>
            {games}
        </div>

    </div>
  )
}

export default PreGame
