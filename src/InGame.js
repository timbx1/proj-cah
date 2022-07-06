import React, { useState , useEffect} from "react";
import Players from './Players'
import './InGame.css'
import axios from "axios";
import config from './config.json'
import Card from "./Card";
import { useTimer } from 'react-timer-hook';
import Timer from "./Timer";
import { Status } from "./Status";
import { Hilfe } from "./Hilfe";

const InGame = (props) => {
    let pointId = 0
    const playerData = props.pData
    const gameid = props.gId
    const [points, setPoints] = useState([])

    const [cards, setCards] = useState()
    const [cardToOfferID, setCardToOfferID] = useState()
    const [cardToOfferText, setCardToOfferText] = useState()

    const [blackCard, setBlackCard] = useState()
    const [czar, setCzar] = useState('loading')

    let pointArray 
    

    useEffect(()=>{
        refresh()
        
      },[])
    function offerCard(cId,text){
        setCardToOfferID(cId)
        setCardToOfferText(text)
        putCard(cId)
    }
    function refresh(){
        pullPoints()
        getBlackCard()
        getCzar()
    }
    //if czar no white cards
    function getCzar(){
        axios.get(config.preUrl+'/games/'+gameid).then(response => {
            setCzar(response.data.czar)
            if(response.data.czar.id != playerData.id){
                getWhiteCards()
            }
        })
    }

    //pull player points
    function pullPoints (){
        axios.get(config.preUrl+'/games/'+gameid).then(response => {
            console.log("points pulled")
            createPoints(response.data.points)
        })
    }
    //map every Player point as paragraph
    function createPoints(pointArr){
        pointArray = pointArr
        var pList = []
        pList.push(<p key={"p1"}> </p>)
        pList.push(pointArr.map((point) => (<div key={pointId+=1}> : {point} |</div>)))
        setPoints(pList)
    }
    //renders White Cards of Player
    //btnboo true => use btn rendernn false => vote btn rendern
    function createWhiteCards(cardsArr,boo){
        let cList = []
        cList.push(cardsArr.map((eintrag) => (
        <div>
            <p> </p>
            <Card key={eintrag.id} btnboo={boo} voteCard={voteCard} offerCard={offerCard} pId={playerData.id} gId={gameid} cId={eintrag.id} text={eintrag.text} />
        </div>
        )))
        setCards(cList)
    }
    //pull white cards of Player to chose
    function getWhiteCards(){
        axios.get(config.preUrl+'/games/'+gameid+'/cards/'+playerData.id).then(response => {
            createWhiteCards(response.data.cards,true)
        })
    }
    // pull black card
    function getBlackCard (){
        axios.get(config.preUrl+'/games/'+gameid).then(response => {
            setBlackCard(response.data.currentBlackCard.text)
        })
    }
    //callback from Vote button in Cards
    function voteCard(){
        console.log("vote")
        refresh()

    }
    // if points change refresh page
    function waitForCzarToVote(){
        console.log('waiting')
        axios.get(config.preUrl+'/games/'+gameid).then(response =>{
            console.log(response.data.points)
            console.log(pointArray)
            if(JSON.stringify(response.data.points) == JSON.stringify(pointArray)){
                waitForCzarToVote()
            }else{
                refresh()
            }
        })
    }
    // offer card to czar
    function putCard(id){
        let Jstring = '{"cards":['+id+']}'
        let msg = JSON.parse(Jstring)
        axios.put(config.preUrl+'/games/'+gameid+'/cards/'+playerData.id,msg).then(response =>{
          waitForCzarToVote()
        })
    }
    //Timer timeout callback wenn czar dann get offers
    function onExpire(){
        if(czar.id === playerData.id){
            //[1] ändernn wenn api rdy
            axios.get(config.preUrl+'/games/'+gameid+'/offers/'+playerData.id).then(response => {
                createWhiteCards(response.data.offers[1],false)
                console.log(response.data.offers[1])
            })
        }
    }

  return (
    <div>
        <p align="center" id="title"> CARDS AGAINST HUMANITY: <Status gId ={gameid}/> <Hilfe/> </p>
        <div id='wrapperPlayerPoints'>
            <div id='players'><Players pData={playerData} gId={gameid} /></div>
            <div id='points'>
                Points: 
                <div>{points}</div>
                
            </div>
            
            <div id="blackCard">
                <div>
                    <p id="blText">{blackCard}</p>
                </div>
            </div>
            <div id="czar">
                <label id="czarLabel">Czar: </label>
                <label id="czarNameLabel"> {czar.name}</label>
            </div>
            <div id="answer">
                    {cardToOfferText}
            </div>
            <div id="timer"><Timer onExpire ={onExpire} /></div>
        </div>
        <div id="cards">

                {cards}
        </div>
    </div>
  )
}

export default InGame