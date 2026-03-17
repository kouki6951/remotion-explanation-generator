import { useCurrentFrame } from 'remotion';

/**
 * 瞬きアニメーションのフック
 * ランダムなタイミングで瞬きを行う
 */
export const useBlinkAnimation = (fps: number): 'open' | 'closed' => {
  const frame = useCurrentFrame();

  // 瞬きのタイミングを決定（約4秒ごとにランダムで瞬き）
  const blinkInterval = fps * 4; // 4秒ごと（fpsに基づいて計算）
  const blinkDuration = Math.ceil(fps * 0.13);   // 瞬き全体の長さ（約0.13秒）

  // 現在のサイクル内での位置
  const cycleFrame = frame % blinkInterval;

  // ランダム性を持たせるため、シード値を使用
  const blinkOffset = Math.floor((Math.sin(Math.floor(frame / blinkInterval)) * 0.5 + 0.5) * (fps * 2));

  // 瞬きの開始タイミング
  const shouldBlink = cycleFrame >= blinkOffset && cycleFrame < blinkOffset + blinkDuration;

  if (shouldBlink) {
    return 'closed'; // 瞬きしている
  } else {
    return 'open'; // 通常は目を開いている
  }
};
