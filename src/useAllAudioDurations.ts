import { useState, useEffect } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import { VideoConfig } from './config';

/**
 * すべての音声ファイルの長さを一度に取得するフック
 */
export const useAllAudioDurations = (config: VideoConfig): Map<string, number> => {
  const [durations, setDurations] = useState<Map<string, number>>(new Map());
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    // すべての音声ファイルのパスを収集
    const audioPaths = new Set<string>();

    config.scenes.forEach(scene => {
      scene.segments?.forEach(segment => {
        if (segment.audio?.voiceover) {
          audioPaths.add(segment.audio.voiceover);
        }
      });
    });

    if (audioPaths.size === 0) {
      setDurations(new Map());
      continueRender(handle);
      return;
    }

    // すべての音声ファイルの長さを取得
    const loadPromises = Array.from(audioPaths).map(async (path) => {
      try {
        const audio = new Audio(staticFile(path));
        await new Promise<void>((resolve, reject) => {
          audio.addEventListener('loadedmetadata', () => {
            const durationInSeconds = audio.duration;
            const durationInFrames = Math.round(durationInSeconds * config.fps);
            resolve();
            return durationInFrames;
          });
          audio.addEventListener('error', reject);
        });

        const durationInSeconds = audio.duration;
        const durationInFrames = Math.round(durationInSeconds * config.fps);
        return { path, duration: durationInFrames };
      } catch (error) {
        console.error(`Failed to load audio: ${path}`, error);
        return { path, duration: 0 };
      }
    });

    Promise.all(loadPromises).then((results) => {
      const map = new Map<string, number>();
      results.forEach(({ path, duration }) => {
        map.set(path, duration);
      });
      setDurations(map);
      continueRender(handle);
    });
  }, [config, handle]);

  return durations;
};
