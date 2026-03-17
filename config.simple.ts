import { VideoConfig } from './src/config';

/**
 * シンプルな設定テンプレート
 * 最小限の項目のみ
 */
export const simpleConfig: VideoConfig = {
  // 基本設定
  title: "シンプル動画",
  fps: 30,
  // durationInFrames: 300,  // 省略すると全シーンの合計から自動計算
  width: 1920,
  height: 1080,

  // キャラクター（1人）
  characters: {
    narrator: {
      name: "ナレーター",
      defaultImage: "/characters/narrator-eyes-open-mouth-closed.png",
      blinkImages: {
        closed: "/characters/narrator-eyes-closed-mouth-closed.png"
      },
      // 口パク用の画像（オプション）
      mouthImages: {
        eyesOpenMouthOpen: "/characters/narrator-eyes-open-mouth-open.png",
        eyesOpenMouthClosed: "/characters/narrator-eyes-open-mouth-closed.png",
        eyesClosedMouthOpen: "/characters/narrator-eyes-closed-mouth-open.png",
        eyesClosedMouthClosed: "/characters/narrator-eyes-closed-mouth-closed.png"
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
      startFrame: 0,  // 最初のシーンのみ指定

      slide: {
        type: 'text',
        content: 'シーン1のタイトル',
        backgroundColor: '#1a1a2e',
        textColor: '#ffffff'
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: 'シーン1の説明文'
          },
          audio: {
            voiceover: "/audio/scene1.mp3"
          }
        }
      ]
    },

    {
      id: "scene2",

      slide: {
        type: 'text',
        content: 'シーン2のタイトル',
        backgroundColor: '#16213e',
        textColor: '#ffffff'
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: 'シーン2の説明文'
          },
          audio: {
            voiceover: "/audio/scene2.mp3"
          }
        }
      ]
    }
  ]
};
