import React, { useState, useEffect } from 'react'
import './PlayAnimation.css';
import axios from 'axios';
import config from './config.json';

function PlayAnimation(props) {
  const pData = props.playerData
  const gameid = props.gId

  const [text,setText] = useState('')

  useEffect(() => {
    get_winner();
  }, []);
  function get_winner(){
    axios.get(config.preUrl + 'games/').then(response => {
      let games = response.data.games
      for(let i=0;i<games.length;i++){
          if (games[i].id == gameid){
              if(games[i].winner.id = pData.id){
                setText('WINNER')
              }
              else{
                setText('LOOSER')
              }   
          }
      } 
  });
  }


    return (
        <div className="container">
          <label className="fancy-label">{text}</label>
        </div>
      );
}

export default PlayAnimation