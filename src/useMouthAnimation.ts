import { useCurrentFrame } from 'remotion';

/**
 * 音声再生時の口パクアニメーション
 *
 * @param isAudioPlaying - 現在のシーンで音声が再生されているか
 * @param fps - フレームレート
 * @returns 'open' | 'closed' - 口の開閉状態
 */
export const useMouthAnimation = (isAudioPlaying: boolean, fps: number): 'open' | 'closed' => {
  const frame = useCurrentFrame();

  // 音声が再生されていない場合は口を閉じる
  if (!isAudioPlaying) {
    return 'closed';
  }

  // 音声再生中は口を開閉（速度をゆっくりに調整）
  // より自然な話し方に見えるよう、ランダム性を持たせる
  const mouthCycle = Math.ceil(fps * 0.67); // 約0.67秒ごと（fpsに基づいて計算）
  const cycleFrame = frame % mouthCycle;

  // ランダム性を追加（フレーム数に基づくシード値）
  const randomOffset = Math.floor((Math.sin(Math.floor(frame / mouthCycle) * 2.5) * 0.5 + 0.5) * (fps * 0.2));

  // 開閉パターン: ランダムオフセット後の約0.27秒は開く、それ以外は閉じる
  const openDuration = Math.ceil(fps * 0.27);
  if (cycleFrame >= randomOffset && cycleFrame < randomOffset + openDuration) {
    return 'open';
  } else {
    return 'closed';
  }
};
