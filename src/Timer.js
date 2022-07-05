import React, { useEffect } from 'react';
import { useTimer } from 'react-timer-hook'
function Timer(props) {
    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({onExpire: () => timeout()});
    function timeout(){
        props.onExpire()
    }
    useEffect(()=>{
        const time = new Date();
        time.setSeconds(time.getSeconds() + 10);
        restart(time)
    },[])
  
    return (
      <div style={{textAlign: 'center'}}>
          <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    );
  }
export default Timer