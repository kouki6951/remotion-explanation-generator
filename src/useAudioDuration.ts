import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';

/**
 * 音声ファイルの長さを自動取得するフック
 * @param audioPath 音声ファイルのパス
 * @param fps フレームレート
 * @returns 音声の長さ（フレーム数）、読み込み中はnull
 */
export const useAudioDuration = (audioPath: string, fps: number): number | null => {
  const [duration, setDuration] = useState<number | null>(null);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    const audio = new Audio(staticFile(audioPath));

    const handleLoadedMetadata = () => {
      const durationInSeconds = audio.duration;
      const durationInFrames = Math.round(durationInSeconds * fps);
      setDuration(durationInFrames);
      continueRender(handle);
    };

    const handleError = () => {
      console.error(`Failed to load audio: ${audioPath}`);
      // エラー時もレンダリングを続行（デフォルト値を使用）
      setDuration(0);
      continueRender(handle);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, [audioPath, fps, handle]);

  return duration;
};
