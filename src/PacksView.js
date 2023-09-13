import React,{ useEffect, useState } from 'react'
import Pack from './Pack'
import axios from 'axios'
import config from './config.json'
function PacksView(props) {
    
    const [packs, setPacks] = useState()

    const [back,setBack] = useState()

    function _init (){
      getPacks()
      console.log('packed')
      if(props.changeUi != null){
          setBack(
            <button onClick={handleBack}>Back</button>
          )
      }
    }
    function handleBack(){
      props.changeUi(0,props.pData,props.gId)
    }

    useEffect(() => {
      _init();
    }, []);

    function getPacks(){
        axios.get(config.preUrl+'packs/').then(response => {
            createPacks(response.data.packs)
            
        })
    }
    function addId(id){
        props.addId(id)
      }
      function removeId(id){
        props.removeId(id)
      }
    function createPacks(pArr){
        let pList = []
        pList.push(pArr.map((eintrag) => (
        <div>
            <p> </p>
            <Pack addId = {addId} removeId = {removeId} usePack = {props.usePack} packName = {eintrag.name} packId={eintrag.id} bcCount = {eintrag.blackCardCount} wcCount = {eintrag.whiteCardCount}/>
        </div>
        )))
        setPacks(pList)
    }
    
  return (
    <div>
        <div>{back}</div>
        <div>{packs}</div>
    </div>
  )
}

export default PacksView
