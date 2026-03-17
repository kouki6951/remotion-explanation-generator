import { Scene } from './config';

/**
 * シーンの長さを計算する
 * @param scene シーン
 * @param audioDurations 音声ファイルパスと長さのマップ
 * @returns シーンの長さ（フレーム数）
 */
export const calculateSceneDuration = (
  scene: Scene,
  audioDurations: Map<string, number>
): number => {
  // durationInFramesが指定されている場合はそれを使用
  if (scene.durationInFrames !== undefined) {
    return scene.durationInFrames;
  }

  // セグメントがない場合はデフォルト値
  if (!scene.segments || scene.segments.length === 0) {
    return 150; // 5秒
  }

  // セグメント内の音声の合計から計算
  let totalDuration = 0;

  for (const segment of scene.segments) {
    if (!segment.audio) continue;

    const delayFrames = segment.audio.delayFrames ?? 0;
    const audioDuration = segment.audio.durationInFrames ?? audioDurations.get(segment.audio.voiceover) ?? 0;

    totalDuration += delayFrames + audioDuration;
  }

  // 音声がない場合はデフォルト値
  if (totalDuration === 0) {
    return 150;
  }

  // シーンの最初と最後に15フレームずつの余白を追加
  return totalDuration + 30;
};
