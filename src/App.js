import './App.css';
import Channel from './components/Channel';
import { useState, useRef, useEffect } from 'react';
import { Slider } from '@mui/material';

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
  // the channel source list controls the number of channels in the application
  const [channelSrcList, setChannelSrcList] = useState(["_tambourine_shake_higher.mp3", "B VOC.mp3",
  "DRUMS.mp3", "HE HE VOC.mp3", "HIGH VOC.mp3", "JIBRISH.mp3", "LEAD 1.mp3", "UUHO VOC.mp3" ]);
  const [colorList, setColorList] = useState(["blue", "cyan", "green","yellow", "orange", "red", "lightcoral", "purple", "pink" ]);
  const [muteObj, setMuteObj] = useState({})  
  
  useEffect(() => {
    // for each channel create a mute object
    let tempMuteList = {};
    channelSrcList.forEach((channelSrc)=>{
      tempMuteList[channelSrc] = false
    })
    setMuteObj(tempMuteList)

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
    //stop the audio and get it ready to play again from the beginning
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
}
  const timeUpdateHandler = () => {
    // this function is responsible of setting the slider to the correct playback location
    let currentTime = masterAudioElement.current.currentTime
    if(audioCurrentTime !== currentTime){
      setSliderValue(currentTime);
      setAudioCurrentTime(currentTime)
    }
  }

  const dataLoaded = () =>{
    // sets the slider attribute according to the audio length and placing the thumb extension in its place
    const duration = Math.round(masterAudioElement.current.duration*2)/2
    setAudioDuration(duration)
    let tempArr = []
    // this loop creates the marks in the slider
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
    // the function is activate by the user dragging the slider 
    // it update the slider value and the audio current time to the selected time
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
                <div className='channel-mute-div' style={{borderLeft:  `4px solid ${colorList[(index%colorList.length)]}`}}>
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
                return <Channel
                          loop={isLoopActive} 
                          isPlaying={isPlaying} 
                          src={channelSrc} 
                          audioCurrentTime={audioCurrentTime}
                          color={colorList[(index%colorList.length)]}
                          muteObj={muteObj}
                          endHandler={endHandler}
                        />           
            })}
            {/* the master audio element mock the regular audio element for 
              managing the audio play in a single and general location 
              that doesn't effect all channels*/}
            <audio
                loop={isLoopActive}
                src={`/audio/${channelSrcList[0]}`}
                ref={masterAudioElement}
                muted
                onLoadedData={dataLoaded}
                onTimeUpdate={timeUpdateHandler}
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