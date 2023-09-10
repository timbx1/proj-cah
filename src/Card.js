import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './Card.css'
import config from './config.json'
const Card = (props) => {
    const [text,setText] = useState("No Text Loaded")
    const [useBtn,setUseBtn] = useState()
    const [type, setType] = useState('')
    //zeigt vote button an oder auch nicht 
    useEffect(()=>{
        setText(props.text)
        if (props.showBtn){
          if(props.btnboo){
            createButtonUse()
          }
          else{
            createButtonVote()
          }
        }
        else{
          setType(props.type)
        }
      },[])

    function useCard(){
      props.offerCard(props.cId,props.text)
    }
    // if czar dann vote button auf offer cards -> callback to inGame
    ///////////////////////////////////////////////////////////////// VOTE NOT WORKING
    function voteCard(){
      console.log('vote')
      let Jstring = '{"cards":['+ props.cId +']}' //{[{"cards":['+ props.cId +']}][1]}
      let msg = JSON.parse(Jstring)
      axios.put(config.preUrl+'/games/'+props.gId+'/offers/'+props.pId,msg).then(response => {
        props.voteCard()
        console.log(response.data)
      })

    }
    function createButtonUse(){
      setUseBtn(<button id='btn' onClick={useCard}>USE</button>)
    }
    function createButtonVote(){
      setUseBtn(<button id='btn' onClick={voteCard}>Vote</button>)
    }
  return (
    <div id='card'>
        <p>{type}</p>
        <p id='txt'>{text}</p>
        <div id="vertical-center">
            <div>{useBtn}</div>
        </div>
    </div>
  )
}

export default Card