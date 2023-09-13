import React, { useState } from 'react'
import Pack from './Pack'
import axios from 'axios'
import config from './config.json'
function Game(props) {

    const [detailsShown, setDetailsShown] = useState(true)

    const id = props.gId
    const player_data = props.playerData
    const owner = props.owner
    const goal = props.goal

    const packsArr = props.packs
    const [packs,setPacks] = useState()

    const playerArr = props.player
    const [player,setPlayer] = useState()

    const [details, setDetails] = useState() 

    const [player_label, setPlayerLabel] = useState('')

    const [joinGameBtn, setJoinGameBtn] = useState()

    function getPacks (){
        let pacArr = []
        for (let i = 0; i < packsArr.length;i++ ){
            axios.get(config.preUrl+'packs/'+ packsArr[i]).then(response =>{
                pacArr.push(response)
            })
        }
        console.log(pacArr)
        createPacks(pacArr)
    }

    function createPacks(pacArr){
        let pList = []
        pList.push(pacArr.map((eintrag) => (
        <div>
            <p> </p>
            <Pack packName = {eintrag.name} packId={eintrag.id} bcCount = {eintrag.blackCardCount} wcCount = {eintrag.whiteCardCount}/>
        </div>
        )))
        setPacks(pList)
    }
    function createPlayer(){
        console.log('im here')
        let pList = []
        pList.push(playerArr.map((eintrag) => (
            <div key={eintrag.id}>
                <p> </p>
                <p>{eintrag.name}</p>
            </div>
            )))
        console.log(pList)
        setPlayer(pList)
    }

    function handleJoinGameBtn(id, player_data){ //playerData not defined error!!!
        console.log(player_data)
        props.joinGame(id, player_data)
    }

    function handleDetails(){
        if(detailsShown){
            getPacks()
            createPlayer() 
            setDetailsShown(false)
            setDetails(
                <div>        
                <p>ID: {id}</p>
                <p></p>
        
                <p>owner: {owner.name}</p>
                <p></p>
        
                <p>Goal: {goal} Points</p>
                <p></p>
                </div>
            )
            setPlayerLabel('Players:')
            setJoinGameBtn(
                <button onClick={() => handleJoinGameBtn(id,player_data)}>JOIN GAME</button>
            )
        }
        else{
            setDetailsShown(true)
            setPacks('')
            setPlayer('')
            setDetails(
                <div></div>
            )
            setPlayerLabel()
            setJoinGameBtn()
        }

        }
  return (
    <div>
        <button onClick={handleDetails}>Details</button>
        <div>{details}</div>
        <div>{player_label}</div>
        <div>{player}</div>
        <div>{joinGameBtn}</div>
        <div>{packs}</div>
        

    </div>
  )
}

export default Game