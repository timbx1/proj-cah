import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './Card.css'
import config from './config.json'
const Card = (props) => {
    const [text,setText] = useState("No Text Loaded")
    const [useBtn,setUseBtn] = useState()
    useEffect(()=>{
        setText(props.text)
        if(props.btnboo){
          createButtonUse()
        }
        else{
          createButtonVote()
        }
      },[])

    function useCard(){
      console.log('use')
      props.offerCard(props.cId,props.text)
    }
    function voteCard(){
      console.log('use')
      props.offerCard(props.cId,props.text)
    }
    function createButtonUse(){
      setUseBtn(<button id='btn' onClick={useCard}>USE</button>)
    }
    function createButtonVote(){
      setUseBtn(<button id='btn' onClick={voteCard}>Vote</button>)
    }
  return (
    <div id='card'>
        <p id='txt'>{text}</p>
        <div class="vertical-center">
            <div>{useBtn}</div>
        </div>
    </div>
  )
}

export default Card