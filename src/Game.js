import React, { useState } from 'react'
import Pack from './Pack'
import axios from 'axios'
import config from './config.json'
function Game(props) {

    const [detailsShown, setDetailsShown] = useState(false)

    const id = props.gId
    const owner = props.owner
    const goal = props.goal

    const packsArr = props.packs
    const [packs,setPacks] = useState()

    const playerArr = props.player
    const [player,setPlayer] = useState()

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
            <div>
                <p> </p>
                <p>{eintrag.name}</p>
            </div>
            )))
        console.log(pList)
        setPlayer(pList)
    }

    function handleDetails(){
        if(detailsShown){
            getPacks()
            createPlayer() 
            setDetailsShown(false)
        }
        else{
            setDetailsShown(true)
            setPacks('')
            setPlayer('')
        }

        }
  return (
    <div>
        <p>ID:</p>
        <p>{id}</p>

        <p>owner:</p>
        <p>{owner}</p>

        <p>Goal: </p>
        <p>{goal} Points</p>

        <button onClick={handleDetails}>Details</button>
        <div>{player}</div>
        <div>{packs}</div>
    </div>
  )
}

export default Game