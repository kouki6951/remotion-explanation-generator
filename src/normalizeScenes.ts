import { Scene } from './config';
import { calculateSceneDuration } from './calculateSceneDuration';

/**
 * シーンを正規化する（startFrameとdurationInFramesを自動計算）
 * @param scenes シーンの配列
 * @param audioDurations 音声ファイルパスと長さのマップ
 * @returns 正規化されたシーンの配列
 */
export const normalizeScenes = (
  scenes: Scene[],
  audioDurations: Map<string, number>
): Array<Scene & { startFrame: number; durationInFrames: number }> => {
  let currentFrame = 0;

  return scenes.map((scene) => {
    // startFrameを計算（指定されていない場合は前のシーンの終了位置）
    const startFrame = scene.startFrame ?? currentFrame;

    // durationInFramesを計算（指定されていない場合は音声の合計から自動計算）
    const durationInFrames = calculateSceneDuration(scene, audioDurations);

    // 次のシーンの開始位置を更新
    currentFrame = startFrame + durationInFrames;

    return {
      ...scene,
      startFrame,
      durationInFrames
    };
  });
};
