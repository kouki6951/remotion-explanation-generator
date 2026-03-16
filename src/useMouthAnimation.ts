import { useCurrentFrame } from 'remotion';

/**
 * 音声再生時の口パクアニメーション
 *
 * @param isAudioPlaying - 現在のシーンで音声が再生されているか
 * @returns 'open' | 'closed' - 口の開閉状態
 */
export const useMouthAnimation = (isAudioPlaying: boolean): 'open' | 'closed' => {
  const frame = useCurrentFrame();

  // 音声が再生されていない場合は口を閉じる
  if (!isAudioPlaying) {
    return 'closed';
  }

  // 音声再生中は3-4フレームごとに口を開閉
  // より自然な話し方に見えるよう、ランダム性を持たせる
  const mouthCycle = 7; // 約0.23秒ごと（30fps）
  const cycleFrame = frame % mouthCycle;

  // ランダム性を追加（フレーム数に基づくシード値）
  const randomOffset = Math.floor((Math.sin(Math.floor(frame / mouthCycle) * 2.5) * 0.5 + 0.5) * 3);

  // 開閉パターン: ランダムオフセット後の3-4フレームは開く、それ以外は閉じる
  if (cycleFrame >= randomOffset && cycleFrame < randomOffset + 4) {
    return 'open';
  } else {
    return 'closed';
  }
};
