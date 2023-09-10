import React,{ useRef, useState } from 'react'
import Pack from './Pack'
import axios from 'axios'
import config from './config.json'
function PacksView() {
    const [packs, setPacks] = useState()
    function getPacks(){
        axios.get(config.preUrl+'packs/').then(response => {
            createPacks(response.data.packs)
            console.log('packed')
        })
    }
    function createPacks(pArr){
        let pList = []
        pList.push(pArr.map((eintrag) => (
        <div>
            <p> </p>
            <Pack packName = {eintrag.name} packId={eintrag.id} bcCount = {eintrag.blackCardCount} wcCount = {eintrag.whiteCardCount}/>
        </div>
        )))
        setPacks(pList)
    }
    
  return (
    <div>
        <div>{packs}</div>
        <button onClick={getPacks}>Load Packs</button>
    </div>
  )
}

export default PacksView
