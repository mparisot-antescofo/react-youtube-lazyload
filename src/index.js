import React, { useState, Fragment, useEffect, useRef } from 'react'
import styles from './styles.module.css'

export const YouTube = (props) => {
  const { videoId, width, height, privacy, onPlayChange, playing, className, imgSize = 'maxresdefault' } =
    props
  const [showVideo, setShowVideo] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    setShowVideo(playing)
    if (playing) {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          '*'
        )
      }
    } else {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*'
        )
      }
    }
  }, [playing])

  const handlePlayButtonClick = () => {
    setShowVideo(true)
    if (onPlayChange) {
      onPlayChange(true)
    }
  }

  const handleStateChange = (event) => {
    // Event data of 0 indicates the video is ended, 1 indicates the video is playing, and 2 indicates the video is paused
    if (event.data === 2) {
      if (onPlayChange) {
        onPlayChange(false)
      }
    }
  }

  return (
    <Fragment>
      {showVideo ? (
        <iframe
          ref={iframeRef}
          className={className}
          width={width || '560px'}
          height={height || '315px'}
          src={`https://www.youtube${
            privacy ? '-nocookie' : ''
          }.com/embed/${videoId}?autoplay=1&showinfo=0&rel=0`}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          // Register the onStateChange event listener
          onLoad={() => {
            iframeRef.current.contentWindow.addEventListener(
              'onStateChange',
              handleStateChange
            )
          }}
        />
      ) : (
        <div
          className={`${styles.image} ${className}`}
          style={{
            backgroundImage: `url(${`https://img.youtube.com/vi/${videoId}/${imgSize}.jpg`})`,
            width,
            height
          }}
          onClick={handlePlayButtonClick}
        >
          <div className={styles.playButton} />
        </div>
      )}
    </Fragment>
  )
}
