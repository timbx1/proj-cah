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
      show_winner(response.data.games)
  });
  }
  function show_winner(games){
    for(let i=0;i<games.length;i++){
      if (games[i].id == gameid){
          if(games[i].winner.id == pData.id){
            setText('WINNER')
            back_to_main()
          }
          else{
            setText('LOOSER')
            back_to_main()
          }   
      }
  } 

  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
  }

  async function back_to_main(){
    await timeout(7000)
    window.location.reload(true);
  }
  }


    return (
        <div className="container">
          <label className="fancy-label">{text}</label>
        </div>
      );
}

export default PlayAnimation