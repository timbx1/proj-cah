import React,{ useRef, useState } from 'react'
import axios from 'axios'
import config from './config.json'
import Recycle_bin from './Recycle_bin'
import { Hilfe } from './Hilfe'
import Game from './Game'

function PreGame({changeUi, pData, gId}) {
    const nameInRef = useRef()
    const [outPreGame, setOutPreGame] = useState("")
    const [gamesLabel, setGamesLabel] = useState("")
    const [nameLabel, setNameLabel] = useState('Enter Name:')
    const [games, setGames] = useState()
    const [searchBox, setSearchBox] = useState(
        <div>
            <input ref={nameInRef} type="text"></input>
            <button onClick={handleSearch} >SEARCH GAME</button>
        </div>
    )

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
    function mapGames (gameArr,data) {
        setGamesLabel('Games:')
        let pList = []
        pList.push(gameArr.map((eintrag) => (
        <div>
            <p> </p>
            <Game joinGame={joinGame} gId={eintrag.id} owner = {eintrag.owner} goal = {eintrag.goal} packs ={eintrag.packs} player = {eintrag.players} playerData={data}></Game>
        </div>
        )))
        setGames(pList)
    }
    //get games
    function searchGame(data){
        setOutPreGame(outPreGame+'.')
        axios.get(config.preUrl+'games/').then(response => {
            console.log(response.data.games)
            //scanGames( response.data.games, data )
            mapGames(response.data.games,data)
        })      
    }

    function postPlayers(inName,createGame){
        var Jstring = '{"name":' +'"' + inName + '"' + '}'
        var msg = JSON.parse(Jstring)
        axios.post(config.preUrl+'players/', msg).then(response =>{
            
            if (createGame){
                goToCreateGame(response.data)
            }
            else{
                searchGame(response.data)
            }
        })
    }
    function update_search_box(inName){
        setSearchBox(
            <label>{inName}</label>
        )

    }
    function goToCreateGame(data){
        changeUi(4,data,gId)
    }
    // wenn name nicht vergeben POST player
    function setName(inName, data, createGame){
        setOutPreGame(outPreGame+'.')
        var send = false
        if (inName == ''){ setOutPreGame("NO NAME ENTERED")}
        else{ 
            if(!(data.length === 0)){
                for(let i = 0; i< data.length;i++){
                    if (data[i].name == inName){
                        setOutPreGame("NAME ALLREADY TAKEN")
                    }
                    else{
                        send = true
                    }    
                    
                }
                if (send){
                    postPlayers(inName,createGame)
                    update_search_box(inName)
                    setNameLabel('Your Name: ')

                }
            }
            else{
                postPlayers(inName,createGame)
                update_search_box(inName)
                setNameLabel('Your Name: ')
            }
        }
        
        
    }
    //get all players
    function getName(createGame){
        setOutPreGame('')
        setOutPreGame("LOADING")
        const inName =nameInRef.current.value

        axios.get(config.preUrl+'players/').then(response => {
            setName(inName, response.data.players, createGame)
        })
    }

    function handleSearch(e){
        getName(false)
        return
    }
    function handleViewPacks(){
        goToGame(3,gId,pData)
    }
    function handleCreateGame(){
        getName(true)
       
    }
  return (
    <div>
        <div>
            <label>{nameLabel}</label>

            <div>{searchBox}</div>
            <button onClick={handleCreateGame}>Create Game</button>
            <button onClick={handleViewPacks}>View Packs</button>
            <Hilfe/>
            <Recycle_bin />
        </div>
        <div>
            <output style={{color: 'red'}}>{outPreGame}</output>
        </div>
        <div>{gamesLabel}</div>
        <div>
            {games}
        </div>

    </div>
  )
}

export default PreGame
