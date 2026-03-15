import { useCurrentFrame } from 'remotion';

/**
 * 瞬きアニメーションのフック
 * ランダムなタイミングで瞬きを行う
 */
export const useBlinkAnimation = (fps: number) => {
  const frame = useCurrentFrame();

  // 瞬きのタイミングを決定（2-5秒ごとにランダムで瞬き）
  const blinkInterval = 120; // 約4秒ごと（30fps × 4秒）
  const blinkDuration = 3; // 瞬き全体の長さ（約0.2秒）

  // 現在のサイクル内での位置
  const cycleFrame = frame % blinkInterval;

  // ランダム性を持たせるため、シード値を使用
  const blinkOffset = Math.floor((Math.sin(Math.floor(frame / blinkInterval)) * 0.5 + 0.5) * 60);

  // 瞬きの開始タイミング
  const shouldBlink = cycleFrame >= blinkOffset && cycleFrame < blinkOffset + blinkDuration;

  if (!shouldBlink) {
    return 'open'; // 通常は目を開いている
  }

  // 瞬きのアニメーション（6フレーム）
  const blinkFrame = cycleFrame - blinkOffset;

  if (blinkFrame < 2) {
    return 'halfClosed'; // 0-1フレーム: 半開き
  } else if (blinkFrame < 4) {
    return 'closed'; // 2-3フレーム: 閉じる
  } else {
    return 'halfClosed'; // 4-5フレーム: 半開き（開く途中）
  }
};
