import { useEffect, useRef } from 'react';
import { FileItem } from '@/utils/types';

interface AudioPreviewProps {
  file: FileItem;
}

export default function AudioPreview({ file }: AudioPreviewProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // 使用 video.js 初始化音频播放器
    const initializePlayer = async () => {
      try {
        if (typeof window !== 'undefined' && audioRef.current) {
          const videojs = (await import('video.js')).default;
          
          const player = videojs(audioRef.current, {
            controls: true,
            autoplay: false,
            preload: 'auto',
            sources: [{
              src: file.viewUrl || file.downloadUrl,
              type: file.mimeType || `audio/${file.name.split('.').pop()?.toLowerCase()}`
            }]
          });
          
          return () => {
            if (player) {
              player.dispose();
            }
          };
        }
      } catch (error) {
        console.error('Error initializing audio player:', error);
      }
    };

    initializePlayer();
  }, [file]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-900 rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-white text-lg font-medium">{file.name}</h3>
        </div>

        <div className="w-full">
          <audio
            ref={audioRef}
            className="video-js vjs-default-skin vjs-big-play-centered"
            controls
            preload="auto"
            data-setup='{"controlBar": {"volumePanel": {"inline": false}}}'
          >
            <source 
              src={file.viewUrl || file.downloadUrl} 
              type={file.mimeType || `audio/${file.name.split('.').pop()?.toLowerCase()}`} 
            />
            <p className="vjs-no-js text-white">
              要收听此音频，请启用JavaScript，并考虑升级到支持HTML5音频的Web浏览器
            </p>
          </audio>
        </div>
      </div>
    </div>
  );
}
