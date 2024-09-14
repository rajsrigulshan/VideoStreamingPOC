import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VideoPlayer from "./VideoPlayer"
import { useRef } from 'react'



function App() {
 const vidPlayerRef=useRef(null)
 const videoLink="http://localhost:8000/uploads/courses/ccb11a1b-167f-4bb2-8ce1-7193710ad58f/index.m3u8"  //"http://localhost:8000/uploads/courses/fdebf01e-a52d-45e5-bf8c-3d06d0f03ceb/index.m3u8";

 const videoPlayerOptions={
  controls:true,
  responsive:true,
  fluid:true,
  sources:[
    {
      src:videoLink,
      type:"application/x-mpegURL"
    }
  ]
 }

 const handlePlayerReady = (player) => {
  vidPlayerRef.current = player;

  // You can handle player events here, for example:
  player.on("waiting", () => {
    videojs.log("player is waiting");
  });

  player.on("dispose", () => {
    videojs.log("player will dispose");
  });
};

  return (
    <>
      <div>
        <h1>Video player</h1>
      </div>
      <VideoPlayer
      options={videoPlayerOptions}
      onReady={handlePlayerReady}
      />
    </>
  )
}

export default App
