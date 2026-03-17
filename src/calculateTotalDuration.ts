import { VideoConfig } from './config';
import { normalizeScenes } from './normalizeScenes';

/**
 * 全シーンの合計フレーム数を計算
 */
export const calculateTotalDuration = (
  config: VideoConfig,
  audioDurations: Map<string, number>
): number => {
  const normalizedScenes = normalizeScenes(config.scenes, audioDurations);

  if (normalizedScenes.length === 0) {
    return 0;
  }

  // 最後のシーンの終了位置を取得
  const lastScene = normalizedScenes[normalizedScenes.length - 1];
  return lastScene.startFrame + lastScene.durationInFrames;
};
