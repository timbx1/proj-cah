import React,{ useRef, useState } from 'react'
import axios from 'axios'
import config from './config.json'
import { Hilfe } from './Hilfe'
import Pack from './Pack'
import PacksView from './PacksView'

function CreateGame(props) {
  const goalInRef = useRef();
  const [goalPoints, setGoalPoints] = useState(10);
  const [packs, setPacks] = useState([]);
  const [currentPacks, setCurrentPacks] = useState([]);
  const [packDiv,setPackDiv] = useState()
  const [showPacks, setShowPacks] = useState(false);
  const [showPacksView, setShowPacksView] = useState(false);
  const [errorMsg,setErrorMsg] = useState('')

  function getPacks(packsToFetch) {
    Promise.all(
      packsToFetch.map((packId) =>
        axios.get(config.preUrl + 'packs/' + packId)
      )
    )
      .then((responses) => {
        const packsObjects = responses.map((response) => response.data);
        setCurrentPacks(packsObjects);
        createPacks(currentPacks);
      })
      .catch((error) => {
        console.error('Error fetching packs:', error);
      });
  }

  function addId(id){
    let arr = []
    for (let i=0; i<packs.length; i++){
      arr.push(packs[i])
    }
    arr.push(id)
    setPacks(arr)
    console.log(id)
  }
  function removeId(id) {
    console.log(id);
    let arr = [];
    for (let i = 0; i < packs.length; i++) {
      if (!(packs[i] === id)) {
        arr.push(packs[i]);
      }
    }
    setPacks(arr);
  }  

  function createPacks(pArr){
    let pList = []
    pList.push(pArr.map((eintrag) => (
      <div key={eintrag.id}>
        <p> </p>
        <Pack usePack={false} packName={eintrag.name} packId={eintrag.id} bcCount={eintrag.blackCardCount} wcCount={eintrag.whiteCardCount} />
      </div>
    )))    
    setPackDiv(pList)
}

  function handleShowPacks() {
  if (!showPacks) {
    getPacks(packs);
    setShowPacks(true);
  } else {
    setPackDiv([]);
    setShowPacks(false);
  }
}

function postGame(owner,packs,goal){
  let gameData = {
    owner: owner,
    packs: packs,
    goal: goal
  };
  let Jstring = JSON.stringify(gameData);
  var msg = JSON.parse(Jstring)
  axios.post(config.preUrl + 'games/',msg).then(response => {
    props.changeUi(1,props.pData,response.data.id)
})
}

  function handleChoosePacks() {
    setShowPacksView(!showPacksView);
  }
  function handleCreateGame(){
    setErrorMsg('')
    if(goalPoints > 0 && goalPoints < 100){
      if(packs.length > 0){
        postGame(props.pData.id,packs,goalPoints)
      }
      else{
        setErrorMsg(errorMsg + ' |Packs should not be empty.| ')
      }
      
    }
    else{
      setErrorMsg(errorMsg + ' |Invalid Points - Value btw. 0 & 100|')
    }

  
  }

  return (
    <div>
      <Hilfe></Hilfe>
      <div>
        <label>Punkte Ziel: </label>
        <input
          ref={goalInRef}
          type="text"
          value={goalPoints}
          onChange={(e) => setGoalPoints(e.target.value)}
        />
        <label style={{ color: 'red' }}>{errorMsg}</label>
      </div>
      <button onClick={handleShowPacks}>
        {showPacks ? 'Hide Current Used Packs' : 'Show Current Used Packs'}
      </button>
      {showPacks}
      <div>{packDiv}</div>
      <div>
        <button onClick={handleChoosePacks}>
          {showPacksView ? 'Hide Packs View' : 'Choose Packs for Game'}
        </button>
      </div>
      <div>
          <button onClick={()=>handleCreateGame(props.pData)}>Start Lobby</button>
      </div>
      {showPacksView && <PacksView addId = {addId} removeId = {removeId} usePack={true}></PacksView>}
    </div>
  );
}

export default CreateGame;
