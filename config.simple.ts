import { VideoConfig } from './src/config';

/**
 * シンプルな設定テンプレート
 * 最小限の項目のみ
 */
export const simpleConfig: VideoConfig = {
  // 基本設定
  title: "シンプル動画",
  fps: 30,
  durationInFrames: 300,  // 10秒
  width: 1920,
  height: 1080,

  // キャラクター（1人）
  characters: {
    narrator: {
      name: "ナレーター",
      defaultImage: "/characters/narrator-open.png",
      blinkImages: {
        halfClosed: "/characters/narrator-half.png",
        closed: "/characters/narrator-closed.png"
      },
      // 位置・サイズ調整（オプション）
      layout: {
        width: '45%',
        height: '95%',
        bottom: '0',
        right: '-50px'
      }
    }
  },

  // シーン（2つ）
  scenes: [
    {
      id: "scene1",
      startFrame: 0,
      durationInFrames: 150,  // 5秒

      slide: {
        type: 'text',
        content: 'シーン1のタイトル',
        backgroundColor: '#1a1a2e',
        textColor: '#ffffff'
      },

      subtitle: {
        text: 'シーン1の説明文'
      },

      character: {
        id: 'narrator'
      }
    },

    {
      id: "scene2",
      startFrame: 150,
      durationInFrames: 150,  // 5秒

      slide: {
        type: 'text',
        content: 'シーン2のタイトル',
        backgroundColor: '#16213e',
        textColor: '#ffffff'
      },

      subtitle: {
        text: 'シーン2の説明文'
      },

      character: {
        id: 'narrator'
      }
    }
  ]
};
