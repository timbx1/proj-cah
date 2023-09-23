import React, { useState } from 'react'
import Pack from './Pack'
import axios from 'axios'
import config from './config.json'
import './Game.css'
function Game(props) {

    const [detailsShown, setDetailsShown] = useState(true)

    const id = props.gId
    const player_data = props.playerData
    const owner = props.owner
    const goal = props.goal

    let showPacks = false

    //const [showPacks, setShowPacks] = useState(false)

    const packsArr = props.packs
    let packs

    const playerArr = props.player
    const [player,setPlayer] = useState(null)

    const [details, setDetails] = useState(null) 

    const [player_label, setPlayerLabel] = useState('')

    const [joinGameBtn, setJoinGameBtn] = useState(null)

    const [packDiv,setPackDiv] = useState(null)

    async function getPacks() {
        try {
          await axios.get(config.preUrl+'packs/').then(response => {
            createPacks(response.data.packs)
            
          })
          
        } catch (error) {
          console.error('Fehler beim Abrufen der Packs:', error);
        }
      }
      

      function createPacks(pacArr) {
        let mapPacs = []
        console.log(packsArr)
        for(let i = 0; i < pacArr.length;i++){
          for(let j = 0; j < packsArr.length;j++){
            if (pacArr[i].id===packsArr[j]){
              mapPacs.push(pacArr[i])
            }   
          }
        }
        console.log(mapPacs)
        const pList = mapPacs.map((eintrag) => (
          <div key={eintrag.id}>
            <p> </p>
            <Pack
              packName={eintrag.name}
              packId={eintrag.id}
              bcCount={eintrag.blackCardCount}
              wcCount={eintrag.whiteCardCount}
            />
          </div>
        ));
        console.log(pList)
        packs=(<div className="popup-container">
        <div className="popup-body">
          <h1>PACKS:</h1>
          {pList}
          <div className="button-container">
          <button className="button" onClick={handleShowPacks}>Close X</button>
          </div>
        </div>
        </div>);
      }
      
    function createPlayer(){
        let pList = []
        pList.push(playerArr.map((eintrag) => (
            <div key={eintrag.id}>
                <p> </p>
                <p>{eintrag.name}</p>
            </div>
            )))
        setPlayer(pList)
    }

    function handleJoinGameBtn(id, player_data){
        props.joinGame(id, player_data)
    }

    function handleShowPacks() {
        if (!showPacks) {
          console.log(showPacks)
          setPackDiv(packs);
          //setShowPacks(true)
          showPacks = true
        } else {
          console.log(showPacks)
          setPackDiv(null);
          //setShowPacks(false)
          showPacks = false
        }
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
                <div>
                    <button onClick={handleShowPacks}>Show/Hide Packs</button>
                    <button onClick={() => handleJoinGameBtn(id,player_data)}>JOIN GAME</button>
                </div>
               
            )
        }
        else{
            setDetailsShown(true)
            setPlayer('')
            setDetails(
                <div></div>
            )
            setPlayerLabel()
            setJoinGameBtn()
        }

        }
  return (
    <div className='body'>
        <button onClick={handleDetails}>Details</button>
        <div>{details}</div>
        
        <div className='preplayers'>
          <div>{player_label}</div>
          <div>{player}</div>
        </div>

        <div>{joinGameBtn}</div>
        <div className='packs-component'>{packDiv}</div>
    </div>
  )
}

export default Game