import { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

function MusicPlayer({ playlist }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  const currentSong = playlist[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // 尝试自动播放（需要用户交互后才能播放）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInteracted) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentIndex, hasInteracted]);

  const handlePlayPause = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    if (!hasInteracted) setHasInteracted(true);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    if (!hasInteracted) setHasInteracted(true);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) setIsMuted(false);
    if (val === 0) setIsMuted(true);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <>
      <audio ref={audioRef} src={currentSong?.url} preload="metadata" />
      
      {/* 悬浮播放器按钮 */}
      <div 
        className={`music-fab ${isExpanded ? 'music-fab--expanded' : ''}`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {isExpanded ? (
          <div className="music-player glass-card" onClick={(e) => e.stopPropagation()}>
            {/* 播放器头部 */}
            <div className="music-player__header">
              <div className="music-player__cover">
                {currentSong?.cover ? (
                  <img src={currentSong.cover} alt={currentSong.title} />
                ) : (
                  <div className="music-player__cover-placeholder">🎵</div>
                )}
                {isPlaying && <div className="music-player__cover-spin"></div>}
              </div>
              <div className="music-player__info">
                <div className="music-player__title">{currentSong?.title || '未播放'}</div>
                <div className="music-player__artist">{currentSong?.artist || '-'}</div>
              </div>
              <button 
                className="music-player__close"
                onClick={() => setIsExpanded(false)}
              >
                ✕
              </button>
            </div>

            {/* 进度条 */}
            <div className="music-player__progress">
              <span className="music-player__time">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="music-player__seek"
              />
              <span className="music-player__time">{formatTime(duration)}</span>
            </div>

            {/* 控制按钮 */}
            <div className="music-player__controls">
              <button className="music-player__btn" onClick={handlePrev}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <button 
                className="music-player__btn music-player__btn--primary"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button className="music-player__btn" onClick={handleNext}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            {/* 音量控制 */}
            <div className="music-player__volume">
              <button className="music-player__volume-btn" onClick={handleMuteToggle}>
                {isMuted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="music-player__volume-slider"
              />
              <span className="music-player__volume-value">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* 播放列表 */}
            <div className="music-player__playlist">
              <div className="music-player__playlist-title">播放列表</div>
              <div className="music-player__playlist-items">
                {playlist.map((song, index) => (
                  <div
                    key={song.id}
                    className={`music-player__playlist-item ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsPlaying(true);
                      if (!hasInteracted) setHasInteracted(true);
                    }}
                  >
                    <span className="music-player__playlist-index">{index + 1}</span>
                    <div className="music-player__playlist-info">
                      <span className="music-player__playlist-name">{song.title}</span>
                      <span className="music-player__playlist-artist">{song.artist}</span>
                    </div>
                    {index === currentIndex && isPlaying && (
                      <div className="music-player__eq">
                        <span></span><span></span><span></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // 收起状态的浮动按钮
          <div className="music-fab__compact">
            <div className={`music-fab__icon ${isPlaying ? 'music-fab__icon--playing' : ''}`}>
              {isPlaying ? (
                <div className="music-fab__bars">
                  <span></span><span></span><span></span><span></span>
                </div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              )}
            </div>
            <button 
              className="music-fab__play"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default MusicPlayer;
