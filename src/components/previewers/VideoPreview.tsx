import { useEffect, useRef } from 'react';
import { FileItem } from '@/utils/types';

interface VideoPreviewProps {
  file: FileItem;
}

export default function VideoPreview({ file }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 使用 video.js 初始化视频播放器
    const initializePlayer = async () => {
      try {
        if (typeof window !== 'undefined' && videoRef.current) {
          const videojs = (await import('video.js')).default;
          
          const player = videojs(videoRef.current, {
            controls: true,
            fluid: true,
            preload: 'auto',
            sources: [{
              src: file.viewUrl || file.downloadUrl,
              type: file.mimeType || `video/${file.name.split('.').pop()?.toLowerCase()}`
            }]
          });
          
          return () => {
            if (player) {
              player.dispose();
            }
          };
        }
      } catch (error) {
        console.error('Error initializing video player:', error);
      }
    };

    initializePlayer();
  }, [file]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          controls
          preload="auto"
          width="100%"
          height="auto"
          data-setup="{}"
        >
          <source 
            src={file.viewUrl || file.downloadUrl} 
            type={file.mimeType || `video/${file.name.split('.').pop()?.toLowerCase()}`} 
          />
          <p className="vjs-no-js">
            要查看此视频，请启用JavaScript，并考虑升级到支持HTML5视频的Web浏览器
          </p>
        </video>
      </div>
    </div>
  );
}
