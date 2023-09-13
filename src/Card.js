import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Card.css';
import config from './config.json';

const Card = (props) => {
  const [text, setText] = useState("No Text Loaded");
  const [useBtn, setUseBtn] = useState(null);
  const [type, setType] = useState('');

  useEffect(() => {

    console.log('props.showBtn:', props.showBtn);
    console.log('props.btnboo:', props.btnboo);

    setText(props.text);

    const renderButton = () => {
      if (props.showBtn) {
        if (props.btnboo) {
          return <button id='btn' onClick={useCard}>USE</button>;
        } else {
          return <button id='btn' onClick={voteCard}>Vote</button>;
        }
      }
      return null;
    };

    setUseBtn(renderButton());
    setType(props.type);
  }, [props.text, props.showBtn, props.btnboo, props.type]);

  function useCard() {
    props.offerCard(props.cId, props.text);
  }

  function voteCard() {
    console.log('vote');
    const Jstring = '{"cards":[' + props.cId + ']}';
    const msg = JSON.parse(Jstring);
    axios.put(config.preUrl + 'games/' + props.gId + '/offers/' + props.pId, msg)
      .then(response => {
        props.voteCard();
        console.log(response.data);
      });
  }

  return (
    <div id='card'>
      <p>{type}</p>
      <p id='txt'>{text}</p>
      <div id="vertical-center">
        <div>{useBtn}</div>
      </div>
    </div>
  );
};

export default Card;
