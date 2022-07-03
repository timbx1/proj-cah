import axios from "axios";
import config from './config.json'

import React from 'react'

const Recycle_bin = () => {
    function clearAPI(){
        axios.get(config.preUrl+'/players/').then(response => {
            clearPlayers(response.data.players)
        })

        function clearPlayers(data){
            for(let i = 0;i < data.length; i++){
                axios.delete(config.preUrl+'/players/'+data[i].id).then(response =>{
                    console.log(response)
                })
            }

        }
        axios.get(config.preUrl+'/games/').then(response => {
            clearGames(response.data.games)
            
        })

        function clearGames(data){
            for(let i = 0;i < data.length; i++){
                axios.delete(config.preUrl+'/games/'+data[i].id).then(response =>{
                    console.log(response)
                })
            }

        }
    }
  return (
    <div>
        <button onClick={clearAPI}>Clear API</button>
    </div>
  )
}

export default Recycle_bin