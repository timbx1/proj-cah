import React, { useState } from 'react'
import './Hilfe.css'
export const Hilfe = () => {
    const [text,setText] = useState()
    const inhalt = <div><p>1. Es gibt einen Czar pro Runde der, </p><p>die beste Karte mit VOTE bestätigt.</p><p>2. Mitspieler können eine Karte, </p><p>per USE einreichen, wenn der Czar diese </p><p> wählt bekommen sie einen Punkt.</p><p>--------------------------------------------------------</p><p>HS Anhalt - Aufsicht: Toni Barth</p><p>by Tim Berend</p></div>
    const [pressed,setPressed] = useState(true)
    function openHelp(){
        if(pressed){
            setPressed( false )
            setText(        
                <div style={{border: '3px solid rgb(174, 186, 218)'}}>
                    <div style={{margin:'5px'}}>{inhalt}</div>
                </div>
            )
        }
        else{ 
            setPressed( true )
            setText()
        }
        
    }
  return (
    <div>
        <button id='help' onClick={openHelp}>HELP</button>
        <div id='helpDiv'>
            {text}
        </div>
    </div>
  )
}
