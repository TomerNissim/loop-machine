import '../Channel.css';
import React, { useEffect, useRef, useState } from 'react';

function Channel(props) {
    const audioElement = useRef(null) 
    const [isMute, setIsMute] = useState(false)
    useEffect(()=>{
        if(props.isPlaying){
            audioElement.current.currentTime  = props.audioCurrentTime
            audioElement.current.play();
        }else{
            audioElement.current.pause()
            audioElement.current.currentTime  = 0

        }
    },[props.isPlaying])
    useEffect(()=>{
        // console.log(props.muteObj);
        console.log(props.muteObj[props.src]);
        if(props.muteObj[props.src] !== isMute){
            setIsMute(props.muteObj[props.src])
        }
    },[props.muteObj])

    return (
        <div className='channel-container' style={{backgroundColor: props.color}}>
            <audio
                loop={props.loop}
                src={`/audio/${props.src}`}
                ref={audioElement}
                onEnded={(e) => {props.endHandler(e)}}
                muted={isMute}
            >
            </audio>
            <div className='channel-track-name'>
                <span style={{backgroundColor: props.color}}>{props.src}</span>
            </div>

        </div>
    );
}

export default Channel;