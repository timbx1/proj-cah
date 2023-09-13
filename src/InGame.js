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

    const [expiryTimestamp, setExpiryTimestamp] = useState(Date.now() + 10000);

    let pointArray;

    //'main method'
    useEffect(() => {
        refresh();
    }, []);

    // load offer preview and put it
    function offerCard(cId, text) {
        setCardToOfferID(cId);
        setCardToOfferText(text);
        putCard(cId);
    }

    // load divs
    function refresh() {
        pullPoints();
        setCards(null);
        setCardToOfferID(null);
        setCardToOfferText(null);
        setBlackCard(null);
        setCzar('loading');
        getBlackCard();
        getCzar();
        restartTimer();
    }

    function restartTimer() {
        setExpiryTimestamp(Date.now() + 10000);
    }

    // if czar no white cards
    function getCzar() {
        axios.get(config.preUrl + 'games/' + gameid).then(response => {
            setCzar(response.data.czar);
            if (response.data.czar.id !== playerData.id) {
                getWhiteCards();
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
            createWhiteCards(response.data.cards, true);
        });
    }

    // pull black card
    function getBlackCard() {
        axios.get(config.preUrl + 'games/' + gameid).then(response => {
            setBlackCard(response.data.currentBlackCard.text);
        });
    }

    // callback from Vote button in Cards
    function voteCard() {
        refresh();
    }

    // if points change refresh page
    function waitForCzarToVote() {
        axios.get(config.preUrl + 'games/' + gameid).then(response => {
            if (JSON.stringify(response.data.points) === JSON.stringify(pointArray)) {
                waitForCzarToVote();
                console.log('waiting_for_Czar')
            } else {
                refresh();
                console.log('refrshing')
            }
        });
    }

    // offer card to czar
    // ----> put wechselt abgegebene Karten
    function putCard(id) {
        //console.log('player: ' + playerData.id + ' game: ' + gameid);
        let Jstring = '{"cards":[' + id + ']}';
        let msg = JSON.parse(Jstring);
        axios.put(config.preUrl + 'games/' + gameid + '/cards/' + playerData.id, msg).then(response => {
            waitForCzarToVote();
        });
    }

    // Timer timeout callback wenn czar dann get offers
    function onExpire() {
        //console.log('player: ' + playerData.id + ' game: ' + gameid);
        if (czar.id === playerData.id) {
            axios.get(config.preUrl + 'games/' + gameid + '/offers/' + playerData.id).then(response => {
                createZarCards(response.data.offers, false);
                console.log(response.data.offers);
            });
        }
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
            <p align="center" id="title"> CARDS AGAINST HUMANITY: <Status gId={gameid}/> <Hilfe/> </p>
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
                <div id="timer"><Timer onExpire={onExpire} expiryTimestamp={expiryTimestamp} /></div>
            </div>
            <div id="cards">
                {cards}
            </div>
        </div>
    )
}

export default InGame;
