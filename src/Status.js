import axios from 'axios'
import React, { useEffect, useState } from 'react'
import config from './config.json'
export const Status = (props) => {
    const [status, setStatus] = useState('loading state ...')
    
    useEffect(()=>{
        getStaus()
    },[])
    //holt spiel array
    function getStaus(){
        axios.get(config.preUrl+'/games/').then(response =>{
            searchForState(response.data.games)
        })
    }
    //sucht jetziges spiel und dessen status
    function searchForState(games){
        for(let i = 0; i < games.length; i++){
            if(games[i].id === props.gId){
                if(games[i].running){
                    setStatus('RUNNING')
                }
                else{
                    setStatus('WAITING')
                }
            }
        }
        getStaus()
    }
  return (
    <div>
        Status: {status} 
    </div>
  )
}
