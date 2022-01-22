import '../Channel.css';
import React, { useEffect, useRef } from 'react';

function Channel(props) {
    const audioElement = useRef(null)
    useEffect(()=>{
        if(props.isPlaying){
            audioElement.current.currentTime  = props.audioCurrentTime
            audioElement.current.play();
            // console.log("the offset is");
            // console.log(audioElement.current.getBoundingClientRect());
        }else{
            audioElement.current.pause()
            audioElement.current.currentTime  = 0

        }
    },[props.isPlaying])
    const muteHandler = () => {
        if(audioElement.current.muted){
            audioElement.current.muted = false
        }else{
            audioElement.current.muted = true
        }
    }
    return (
        <div className='channel-container'>
            <audio
                loop={props.loop}
                src={`/audio/${props.src}`}
                ref={audioElement}
            >
            </audio>
            <div className='channel-detail'>
                <img className='channel-detail-button-img' src="/image/mute.png" onClick={muteHandler}/>
            </div>
            <div className='channel-track' style={{backgroundColor: props.color}}>
                <span>{props.src}</span>
            </div>

        </div>
    );
}

export default Channel;