import logo from './logo.svg';
import './App.css';
import Channel from './components/Channel';
import { useState, useRef, useEffect } from 'react';
import { Slider } from '@mui/material';
// import { minHeight } from '@mui/system';

function App() {
  const [isLoopActive, setIsLoopActive] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const [marksList, setMarksList] = useState([])
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const masterAudioElement = useRef(null)
  const sliderContainerRef = useRef(null)
  const thumbExtensionRef = useRef(null)
  const channelDivRef = useRef(null)
  const [channelSrcList, setChannelSrcList] = useState(["_tambourine_shake_higher.mp3", "ALL TRACK.mp3", "B VOC.mp3",
  "DRUMS.mp3", "HE HE VOC.mp3", "HIGH VOC.mp3", "JIBRISH.mp3", "LEAD 1.mp3", "UUHO VOC.mp3" ]);
  const [colorList, setColorList] = useState(["blue", "cyan", "green","yellow", "orange", "red", "lightcoral", "purple", "pink" ]);
  const [muteObj, setMuteObj] = useState({})
  const [muteList, setMuteList] = useState([])
  
  
  useEffect(() => {
    // for each channel create a mute object
    let tempMuteList = {};
    channelSrcList.forEach((channelSrc)=>{
      tempMuteList[channelSrc] = false
    })
    setMuteObj(tempMuteList)
    let tempMuteList2 = [];
    channelSrcList.forEach((channelSrc, index)=>{
      tempMuteList2.push(false)
    })
    setMuteList(tempMuteList2)

    // handles the thumb extension(cursor on all channels) place and height
    function handleResize() {
      let {height, y} = channelDivRef.current.getBoundingClientRect()
      thumbExtensionRef.current.style.height = (height + 35) + 'px';
      thumbExtensionRef.current.style.top = (y) + 'px';
    }
    handleResize()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const playHandler = () => {
    setIsPlaying(true)
    masterAudioElement.current.play()
  }
  const stopHandler = () => {
    setIsPlaying(false)
    masterAudioElement.current.pause()
    masterAudioElement.current.currentTime  = 0
    setAudioCurrentTime(0)
    setSliderValue(0);
  }
  const muteHandler = (e) => {
    setMuteObj({
      ...muteObj,
      [e.target.name]: !muteObj[e.target.name]
    })
    // if(audioElement.current.muted){
    //     audioElement.current.muted = false
    // }else{
    //     audioElement.current.muted = true
    // }
}
  const timeUpdate = () => {
    let currentTime = masterAudioElement.current.currentTime
    if(audioCurrentTime !== currentTime){
      setSliderValue(currentTime);
      setAudioCurrentTime(currentTime)
    }
  }

  const dataLoaded = () =>{
    // sets the slider attribute that relay on the audio length and placing the thump extension in his place
    const duration = Math.round(masterAudioElement.current.duration*2)/2
    console.log(duration);
    setAudioDuration(duration)
    let tempArr = []
    for(let i = 0; i <= (duration*2); i++){
      if((i % 2) === 0){
        tempArr.push({label: `${i/2}`, value: (i/2)})
      }else{
        tempArr.push({label: "", value: (i/2)})
      }
    }
    setMarksList(tempArr)
    let thumb = document.getElementsByClassName('MuiSlider-thumb')[0]
    thumb.appendChild(thumbExtensionRef.current)
  }

  const sliderChangeHandler = (e) => {
    // give the drag an drop ability to the user 
    let value = e.target.value
    if(sliderValue !== value){
      setSliderValue(value);
      masterAudioElement.current.currentTime = value
      setAudioCurrentTime(value)
    }
  }
  const endHandler = (e) => {
    //get the audio ready to play again
    let audioElement = e.target
    setIsPlaying(false)
    audioElement.currentTime = 0    
  }

  return (
    <div className="App">
      <div className='loop-machine'>
        <div className='main-section'>
          <div className='mute-duration-index'>
            <div className='duration-index'>
              <span className='duration-index-text'>{Math.floor(audioCurrentTime)}</span>
            </div>
            {channelSrcList.map((channelSrc, index)=>{
              return(
                <div className='channel-mute-div' style={{borderLeft:  `4px solid ${colorList[index]}`}}>
                      <img 
                        className='channel-mute-div-img' 
                        name={channelSrc} 
                        src={muteObj[channelSrc]? "/image/mute.png" : "/image/sound.png"}
                        onClick={muteHandler}
                      />
                  </div>
                )     
              })}
          </div>
          <div className='slider-channel-container' ref={channelDivRef}>
            <div className='slider-container' ref={sliderContainerRef}>
              <span className='thumb-extension' ref={thumbExtensionRef}></span>
              <Slider
                aria-label="Custom marks"
                defaultValue={0}
                step={0.5}
                min={0}
                max={audioDuration}
                marks={marksList}
                value={sliderValue}
                onChange={sliderChangeHandler}
              />
            </div>
            {channelSrcList.map((channelSrc, index)=>{
              // console.log(channelSrc);
              // {console.log(muteObj.channelSrc);}
                return <Channel
                          loop={isLoopActive} 
                          isPlaying={isPlaying} 
                          src={channelSrc} 
                          audioCurrentTime={audioCurrentTime}
                          color={colorList[index]}
                          muteObj={muteObj}
                          endHandler={endHandler}
                          // isMute={muteObj.channelSrc !== undefined? muteObj.channelSrc : false }
                        />           
            })}
            {/* the master audio element mock the regular audio element for extracting data to use in the app*/}
            <audio
                loop={isLoopActive}
                src={`/audio/${channelSrcList[0]}`}
                ref={masterAudioElement}
                muted
                onLoadedData={dataLoaded}
                onTimeUpdate={timeUpdate}
                onEnded={endHandler}

            >
            </audio>
          </div>
        </div>
        <div className='footer'>
            <button 
              className={isPlaying?'footer-button button-active':'footer-button'}
              type='button'
              onClick={playHandler}
            >
               <img 
                className={isPlaying?'footer-button-img button-active':'footer-button-img'}
                src='/image/play.png'
              />
              <span 
              className={isPlaying?'footer-button-text button-active':'footer-button-text'}
              >
                Play
              </span>
            </button>
            <button className='footer-button' type='button' onClick={stopHandler}>
              <img className='footer-button-img' src='/image/stop.png'/>
              <span className='footer-button-text'>Stop</span>
            </button>
            <button 
              className={isLoopActive?'footer-button button-active':'footer-button'} 
              type='button'
               onClick={()=>{setIsLoopActive(!isLoopActive)}}
            >
              <img 
                className={isLoopActive?'footer-button-img button-active':'footer-button-img'}
                src='/image/loop.png'
              />
              <span 
              className={isLoopActive?'footer-button-text button-active':'footer-button-text'}
              >
                Loop
              </span>            
            </button>
        </div>
      </div>
    </div>
  );
}

export default App;