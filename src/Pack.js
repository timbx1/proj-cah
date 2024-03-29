import React, { useState, useEffect } from 'react'
import Card from './Card'
import axios from 'axios'
import config from './config.json'
function Pack(props) {
    const id = props.packId
    const packName = props.packName
    const bcCount = props.bcCount
    const wcCount = props.wcCount
    const [packOpen , setPackOpen] = useState()
    const [whiteCards,setWhiteCards] = useState()
    const [blackCards,setBlackCards] = useState()
    const [buttonTag, setButtonTag]= useState("SHOW PACK")

    const [usePackBtn,setUsePackBtn] = useState()

    const [showUsePacks, setShowUsePacks] = useState(false);

    function _init(){
        if (props.usePack){
            setUsePackBtn(
                <button onClick={handleUsePack}>
                {showUsePacks ? 'Remove Pack' : 'Choose Pack'}
              </button>
            )
        }
    }

    useEffect(() => {
        _init()
      }, []);
      

    function showPack(){

        if (packOpen){
            setButtonTag("SHOW PACK")
            setBlackCards('')
            setWhiteCards('')
            setPackOpen(false)
        }
        else{
            setButtonTag("HIDE PACK")
            getCards()
            setPackOpen(true)
        }
        
    }
    function getCards() {
        axios.get(config.preUrl+'packs/'+id).then(response=>{
            createWhiteCards(response.data.white)
            createBlackCards(response.data.black)
        })
    }
    function createWhiteCards(cardsArr){
        let cList = []
        cList.push(cardsArr.map((eintrag) => (
        <div>
            <p> </p>
            <Card key={eintrag.id} type='WhiteCard' showBtn={false}cId={eintrag.id} text={eintrag.text} />
        </div>
        )))
        setWhiteCards(cList)
    }
    function createBlackCards(cardsArr){
        let cList = []
        cList.push(cardsArr.map((eintrag) => (
        <div>
            <p> </p>
            <Card key={eintrag.id} type='BlackCard' showBtn={false} cId={eintrag.id} text={eintrag.text} />
        </div>
        )))
        setBlackCards(cList)
    }
    function handleUsePack(){
        setShowUsePacks(!showUsePacks)
        if(!showUsePacks){
            props.addId(id)
        }
        else{
            props.removeId(id)
        }
    }

  return (
    <div id = 'card'>

        {usePackBtn}

        <p>Pack</p>
        <p>ID:</p>
        <p>{id}</p>
        <p>name:</p>
        <p>{packName}</p>
        <p>Black Card Count:</p>
        <p>{bcCount}</p>
        <p>White Card Count:</p>
        <p>{wcCount}</p>
        <button onClick={showPack}>{buttonTag}</button>
        <div>{whiteCards}</div>
        <div>{blackCards}</div>
        
    </div>
  )
}

export default Pack