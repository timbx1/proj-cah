import React, { useEffect, useRef } from 'react';
import { useTimer } from 'react-timer-hook';

function Timer(props) {
  const {
    seconds,
    minutes,
    restart,
    expiryTimestamp,
  } = useTimer({ expiryTimestamp: props.expiryTimestamp });

  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = restart; // Store the restart function in a ref

    // When the component unmounts, clear the timer
    return () => {
      timerRef.current(null);
    };
  }, [props.expiryTimestamp]);

  useEffect(() => {
    // When the timer expires, call the onExpire callback
    if (minutes === 0 && seconds === 0) {
      props.onExpire();
    }
  }, [minutes, seconds, props.onExpire]);

  return (
    <div style={{ textAlign: 'center' }}>
      <span>{minutes < 10 ? '0' : ''}{minutes}</span>:<span>{seconds < 10 ? '0' : ''}{seconds}</span>
    </div>
  );
}

export default Timer;
