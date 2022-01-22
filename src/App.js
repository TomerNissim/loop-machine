import logo from './logo.svg';
import './App.css';
import Channel from './components/Channel';
import { useState, useRef, useEffect } from 'react';
import { Slider } from '@mui/material';
import { minHeight } from '@mui/system';

function App() {
  const [isLoopActive, setIsLoopActive] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const [marksList, setMarksList] = useState([])
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [thumbExtension, setThumbExtension] = useState(0)
  const masterAudioElement = useRef(null)
  const sliderContainerRef = useRef(null)
  const thumbExtensionRef = useRef(null)
  const channelDivRef = useRef(null)
  const [channelSrcList, setChannelSrcList] = useState(["_tambourine_shake_higher.mp3", "ALL TRACK.mp3", "B VOC.mp3",
  "DRUMS.mp3", "HE HE VOC.mp3", "HIGH VOC.mp3", "JIBRISH.mp3", "LEAD 1.mp3", "UUHO VOC.mp3" ]);
  const [colorList, setColorList] = useState(["blue", "cyan", "green","yellow", "orange", "red", "lightcoral", "purple", "pink" ]);

  // useEffect(()=>{
  //   thumbExtensionXChange(audioCurrentTime)
  // },[audioCurrentTime])
  useEffect(() => {
    function handleResize() {
      let {height, y} = channelDivRef.current.getBoundingClientRect()
      thumbExtensionRef.current.style.height = (height + 35) + 'px';
      thumbExtensionRef.current.style.top = (y - 37) + 'px';
    }
    handleResize()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const playHandler = () => {
    setIsPlaying(true)
    masterAudioElement.current.play()
  }
  const pauseHandler = () => {
    setIsPlaying(false)
    masterAudioElement.current.pause()
    masterAudioElement.current.currentTime  = 0
    setAudioCurrentTime(0)
    setSliderValue(0);
  }
  const thumbExtensionXChange = (audioCurrentTime) =>{
    // console.log(audioCurrentTime);
    let thumb = document.querySelector(`[data-index='${audioCurrentTime*2}']`)
    if(thumb){
      let x = thumb.getBoundingClientRect().x
      thumbExtensionRef.current.style.left = x + 'px';
    }
  }
  const timeUpdate = () => {
    let currentTime = masterAudioElement.current.currentTime
    console.log(currentTime);
    let floorCurrentTime =  Math.floor(currentTime*2)/2
    thumbExtensionXChange(currentTime)
    // thumbExtensionXChange(floorCurrentTime)
      setSliderValue(currentTime);
      setAudioCurrentTime(currentTime)
      // console.log(Math.floor(currentTime*2)/2);
      // console.log(currentTime);
    
  }

  const dataLoaded = () =>{
    const duration = Math.floor(masterAudioElement.current.duration)
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
    let lastMark = document.querySelector(`[data-index='${duration*2}']`)
    let firstMark = document.querySelector(`[data-index='${0}']`)
    let railSpan = document.getElementsByClassName('MuiSlider-rail')[0]
    console.log(firstMark.getBoundingClientRect().x);
    console.log(railSpan.getBoundingClientRect());
    console.log(lastMark);
    if(lastMark && firstMark && railSpan){
      let firstMarkX = firstMark.getBoundingClientRect().x
      let lastMarkX = lastMark.getBoundingClientRect().x
      console.log("hi");
      console.log(lastMarkX-firstMarkX);
      console.log(railSpan.getBoundingClientRect());
      // audio*100/duration*2
    }
  }

  const sliderChangeHandler = (e) => {
    let value = e.target.value
    if(sliderValue !== value){
      setSliderValue(value);
      masterAudioElement.current.currentTime = value
      setAudioCurrentTime(value)
    }
  }

  return (
    <div className="App">
      <div className='loop-machine'>
        <div className='main-section'>
          <span className='thumb-extension' ref={thumbExtensionRef}> </span>
          <div className='main-slider-index'>
            <div className='duration-index'>
              {Math.floor(audioCurrentTime)}
            </div>
            <div className='slider-container' ref={sliderContainerRef}>
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
          </div>
          <div className='channel-div' ref={channelDivRef}>
            {channelSrcList.map((channelSrc, index)=>{
                return <Channel
                          loop={isLoopActive} 
                          isPlaying={isPlaying} 
                          src={channelSrc} 
                          audioCurrentTime={audioCurrentTime}
                          color={colorList[index]}
                        />           
            })}
            <audio
                loop={isLoopActive}
                src={`/audio/${channelSrcList[0]}`}
                ref={masterAudioElement}
                muted
                onLoadedData={dataLoaded}
                onTimeUpdate={timeUpdate}
            >
            </audio>
          </div>
        </div>
        <div className='footer'>
            <button type='button' onClick={playHandler}>
              <img className='footer-button-img' src='/image/play.png'/>Play
            </button>
            <button type='button' onClick={pauseHandler}>
              <img className='footer-button-img' src='/image/pause.png'/>Pause
            </button>
            <button type='button' onClick={()=>{setIsLoopActive(!isLoopActive)}}>
              <img className='footer-button-img' src='/image/loop.png'/>Loop
            </button>
        </div>
      </div>
    </div>
  );
}

export default App;