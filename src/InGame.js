import React, { useState, useEffect } from "react";
import Players from './Players';
import './InGame.css';
import axios from "axios";
import config from './config.json';
import Card from "./Card";
import { useTimer } from 'react-timer-hook';
import Timer from "./Timer";
import { Status } from "./Status";
import { Hilfe } from "./Hilfe";

const InGame = (props) => {
    let pointId = 0;
    const playerData = props.pData;
    const gameid = props.gId;
    const [points, setPoints] = useState([]);

    const [cards, setCards] = useState();
    const [cardToOfferID, setCardToOfferID] = useState();
    const [cardToOfferText, setCardToOfferText] = useState();

    const [blackCard, setBlackCard] = useState();
    const [czar, setCzar] = useState('loading');


    let pointArray = [];
    let cardIdsArray = []
    let picksInBC
    let running = true
    let czarId;

    //'main method'
    useEffect(() => {
        refresh();
    }, []);

    // load divs
    function refresh() {
        is_game_running()
        if(running){
            pullPoints()
            cardIdsArray= []
            voteCardIds = []
            setCards(null);
            setCardToOfferID(null);
            setCardToOfferText(null);
            setBlackCard(null);
            getBlackCard();
            getCzar();
        }
    }
    //returned runnning variable der API
    function is_game_running(){
        axios.get(config.preUrl + 'games/').then(response => {
            check_game_end(response.data.games)
        });
    }
    function check_game_end(games){
        for(let i=0;i<games.length;i++){
            if (games[i].id == gameid){
                running = games[i].running
                if(running){
                    return
                }
                else{
                    console.log('animation')
                    play_animation()
                }   
            }
        }
    }

    function play_animation(){
        props.changeUi(5, playerData, gameid)
    }

    // load offer preview and put it
    function offerCard(cId, text) {

        cardIdsArray.push(cId,)
        console.log(cId)
        setCardToOfferID(cId);
        setCardToOfferText(text);
        console.log(picksInBC)

        let picks = []
        for (let i = 0; i < cardIdsArray.length;i++){
            if (i > cardIdsArray.length-1-picksInBC){
                picks.push(cardIdsArray[i])
            }
        }
        if(picks.length = picksInBC){
            console.log('offeredCard')
            putCard(picks);
        }
    
            
    }

    // if czar no white cards
    function getCzar() {
        axios.get(config.preUrl + 'games/' + gameid).then(response => {
            setCzar(response.data.czar);
            czarId=response.data.czar.id
            if (response.data.czar.id !== playerData.id) {
                getWhiteCards();
            }
            else{
                getWaitingPlayers();
            }
        });
    }

    // pull player points
    function pullPoints() {
        axios.get(config.preUrl + 'games/' + gameid).then(response => {
            createPoints(response.data.points);
        });
    }

    // map every Player point as a paragraph
    function createPoints(pointArr) {
        pointArray = pointArr;
        var pList = [];
        pList.push(<p key={"p1"}> </p>);
        pList.push(pointArr.map((point) => (<div key={pointId += 1}> : {point} |</div>)));
        setPoints(pList);
    }

    // renders White Cards of Player
    // btnboo true => use btn rendernn false => vote btn rendern
    function createWhiteCards(cardsArr, boo) {
        let cList = [];
        cList.push(cardsArr.map((eintrag) => (
            <div>
                <p> </p>
                <Card key={eintrag.id} showBtn={true} btnboo={boo} voteCard={voteCard} offerCard={offerCard} pId={playerData.id} gId={gameid} cId={eintrag.id} text={eintrag.text} />
            </div>
        )));
        setCards(cList);
    }

    // pull white cards of Player to choose
    function getWhiteCards() {
        axios.get(config.preUrl + 'games/' + gameid + '/cards/' + playerData.id).then(response => {
            console.log(response.data.cards)
            createWhiteCards(response.data.cards, true);
        });
    }

    // pull black card
    function getBlackCard() {
        axios.get(config.preUrl + 'games/' + gameid).then(response => {
            setBlackCard(response.data.currentBlackCard.text);
            picksInBC = response.data.currentBlackCard.pick
        });
    }

    let voteCardIds=[]
    // callback from Vote button in Cards
    function voteCard(cId) {
        voteCardIds.push(cId)
        let picks = []
        for (let i = 0; i < voteCardIds.length;i++){
            if (i > voteCardIds.length-1-picksInBC){
                picks.push(voteCardIds[i])
                console.log(voteCardIds[i])
            }
        }
        if(picks.length = picksInBC){
            console.log('voted')
            putVoteCard(picks);
        }
        
    
    }
    function putVoteCard(cIdArr){
        console.log('Vote');
        let id_string = JSON.stringify(cIdArr);
        let Jstring = `{"cards": ${id_string}}`;
        const msg = JSON.parse(Jstring);
        // Ein axios-Aufruf, um die Abstimmung durchzuführen
        axios.put(config.preUrl + 'games/' + gameid + '/offers/' + playerData.id, msg)
          .then(response => {
            refresh();
            console.log(response.data);
          })
          .catch(error => {
            console.error('Fehler beim Abstimmen:', error);
          });
        
    }

    // if points change refresh page
    function waitForCzarToVote() {
        is_game_running()
        if(running){
            axios.get(config.preUrl + 'games/' + gameid).then(response => {
                if (JSON.stringify(response.data.points) === JSON.stringify(pointArray)) {
                    waitForCzarToVote();
                    console.log(response.data.points)
                    console.log(pointArray)
                    console.log('waiting_for_Czar')
                } else {
                    refresh();
                    console.log('refreshing')
                }
            });
        }
    }

    // offer card to czar
    // ----> put wechselt abgegebene Karten
    function putCard(id) {
        console.log(id)
        //console.log('player: ' + playerData.id + ' game: ' + gameid);
        let id_string = JSON.stringify(id);
        let Jstring = `{"cards": ${id_string}}`;
        let msg = JSON.parse(Jstring);
        axios.put(config.preUrl + 'games/' + gameid + '/cards/' + playerData.id, msg).then(response => {
            waitForCzarToVote();
        });
    }

    // Timer timeout callback wenn czar dann get offers
    async function onExpire() {
        await timeout(2000)
        console.log('expire');
        //console.log('player: ' + playerData.id + ' game: ' + gameid);
        if (czarId == playerData.id) {
            console.log('Player is Czar')
            axios.get(config.preUrl + 'games/' + gameid + '/offers/' + playerData.id).then(response => {
                console.log('creatingCzarCards')
                createZarCards(response.data.offers, false);
                
            });
        }
        else{
            console.log('Player is Not Czar')
        }
    }
    function checkForPlayers(data){
        console.log(data.waitingForPlayers)
        if (data.waitingForPlayers === 0){
            onExpire()
        }
        else{ 
            console.log('checking_for_players')
            getWaitingPlayers()
        }

    }
    //wenn alle player cards abgegeben dann onExpire
    function getWaitingPlayers (){
        axios.get(config.preUrl + 'games/' + gameid).then(response => {
            checkForPlayers(response.data)
        });
    }

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    function createZarCards(cardsArr,boo){
        let cList = []
        for (let i = 0 ; i <cardsArr.length; i++ ){
            
            cList.push(cardsArr[i].map((eintrag) => (
            <div>
                <p> </p>
                <Card key={eintrag.id} btnboo={boo} showBtn = {true} voteCard={voteCard} offerCard={offerCard} pId={playerData.id} gId={gameid} cId={eintrag.id} text={eintrag.text} />
            </div>
            )))
            
        }
        setCards(cList)  
    }

    return (
        <div>
            <div align="center" id="title"> <p>CARDS AGAINST HUMANITY: </p><Status gId={gameid}/> <Hilfe/> </div>
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
                
            </div>
            <div id="cards">
                {cards}
            </div>
        </div>
    )
}
//<div id="timer"><Timer onExpire={onExpire} expiryTimestamp={expiryTimestamp} /></div>
export default InGame;
