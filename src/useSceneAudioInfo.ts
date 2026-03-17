import { useMemo } from 'react';
import { Scene } from './config';

export interface SegmentAudioInfo {
  startFrame: number;  // シーン内での相対開始フレーム
  endFrame: number;    // シーン内での相対終了フレーム
  duration: number;    // 音声の長さ
}

/**
 * シーン内の各セグメントの音声情報を計算する
 * @param scene シーン
 * @param audioDurations 音声ファイルパスと長さのマップ
 */
export const useSceneAudioInfo = (
  scene: Scene,
  audioDurations: Map<string, number>
): SegmentAudioInfo[] => {
  // 音声情報を計算
  const audioInfo = useMemo(() => {
    if (!scene.segments) return [];

    const result: SegmentAudioInfo[] = [];
    let currentOffset = 0;

    scene.segments.forEach((segment) => {
      if (!segment.audio) return;

      // 指定されたdurationInFramesまたは自動取得した値を使用
      const duration = segment.audio.durationInFrames ?? audioDurations.get(segment.audio.voiceover) ?? 0;

      if (duration === 0) return; // まだ読み込み中または読み込み失敗

      const delayFrames = segment.audio.delayFrames ?? 0;
      const startFrame = currentOffset + delayFrames;
      const endFrame = startFrame + duration;

      result.push({
        startFrame,
        endFrame,
        duration
      });

      currentOffset += delayFrames + duration;
    });

    return result;
  }, [scene.segments, audioDurations]);

  return audioInfo;
};
