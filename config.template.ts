import { VideoConfig } from './src/config';

/**
 * 動画設定のテンプレート
 * このファイルをコピーして使用してください
 */
export const videoConfig: VideoConfig = {
  // ========================================
  // 基本設定
  // ========================================
  title: "動画タイトル",
  fps: 30,                    // フレームレート（通常は30）
  // durationInFrames: 600,   // 総フレーム数（省略すると全シーンの合計から自動計算）
  width: 1920,                // 動画の幅
  height: 1080,               // 動画の高さ

  // ========================================
  // 背景画像（オプション）
  // ========================================
  // 推奨サイズ: 1920 × 1080px（動画の解像度と同じ）
  // 形式: PNG または JPG
  backgroundImage: "/backgrounds/your-background.png",

  // ========================================
  // BGM設定（オプション）
  // ========================================
  backgroundMusic: {
    path: "/audio/bgm.mp3",   // BGMファイルのパス（MP3推奨）
    volume: 0.3               // 音量 0.0～1.0（0.3 = 30%）
  },

  // ========================================
  // キャラクター定義
  // ========================================
  characters: {
    // キャラクターID（任意の名前）
    narrator: {
      name: "ナレーター",

      // 目を開いている・口を閉じている状態の画像（通常時に表示）
      defaultImage: "/characters/narrator-eyes-open-mouth-closed.png",

      // 瞬き用の画像（口は閉じている状態）
      blinkImages: {
        closed: "/characters/narrator-eyes-closed-mouth-closed.png"
      },

      // 口パク用の画像（オプション）
      // 音声再生時に瞬きと口パクを組み合わせて使用（4パターン）
      mouthImages: {
        eyesOpenMouthOpen: "/characters/narrator-eyes-open-mouth-open.png",
        eyesOpenMouthClosed: "/characters/narrator-eyes-open-mouth-closed.png",      // defaultImageと同じでOK
        eyesClosedMouthOpen: "/characters/narrator-eyes-closed-mouth-open.png",
        eyesClosedMouthClosed: "/characters/narrator-eyes-closed-mouth-closed.png"   // blinkImages.closedと同じでOK
      },

      // 表示位置・サイズの設定（オプション）
      layout: {
        width: '45%',       // 画面幅の45%
        height: '95%',      // 画面高さの95%
        bottom: '0',        // 下端に配置
        right: '-50px'      // 右端から-50px（少しはみ出す）
        // left: '50px'     // 左側に配置する場合（rightの代わり）
      }
    },

    // 複数のキャラクターを定義可能
    // assistant: {
    //   name: "アシスタント",
    //   defaultImage: "/characters/assistant-open.png",
    //   blinkImages: {
    //     halfClosed: "/characters/assistant-half.png",
    //     closed: "/characters/assistant-closed.png"
    //   },
    //   layout: {
    //     width: '40%',
    //     height: '90%',
    //     bottom: '0',
    //     left: '50px'     // 左側に配置
    //   }
    // }
  },

  // ========================================
  // シーン定義
  // ========================================
  scenes: [
    // ----------------------------------------
    // シーン1: オープニング（0秒～5秒）
    // ----------------------------------------
    {
      id: "opening",
      startFrame: 0,           // 最初のシーンのみ指定（以降は自動計算）
      // durationInFrames: 150,   // 省略すると音声の長さから自動計算されます

      // スライド設定
      slide: {
        type: 'text',          // 'text' | 'image' | 'pdf'
        title: 'イントロ',     // 副題（左上に表示、オプション）
        content: 'タイトル\n複数行も可能',   // \nで改行可能
        fontSize: 80,          // テキストのフォントサイズ（type: 'text'の場合、オプション、デフォルト: 80）
        backgroundColor: '#1a1a2e',
        textColor: '#ffffff'
        // backgroundImage: '/slides/bg.png'  // スライド専用背景（オプション）
      },

      // キャラクター設定
      character: {
        id: 'narrator'         // charactersで定義したID
      },

      // セグメント設定（オプション、字幕と音声のペア、複数設定可能で順次再生）
      segments: [
        {
          subtitle: {
            text: 'ここに字幕テキストを入力します',
            color: '#ffffff',      // オプション（デフォルト: 白）
            fontSize: 24           // オプション（デフォルト: 24）
          },
          audio: {
            voiceover: "/audio/scene1.mp3",    // ナレーション音声（MP3, WAV推奨）
            // durationInFrames: 75,           // 省略すると音声ファイルから自動取得
            delayFrames: 0,                    // 開始遅延（フレーム数、オプション、デフォルト: 0）
            volume: 1.0                         // 音量 0.0～1.0（オプション、デフォルト: 1.0）
          }
        },
        {
          subtitle: {
            text: '2つ目の字幕テキスト',
            fontSize: 24
          },
          audio: {
            voiceover: "/audio/scene1-2.mp3",  // 2つ目の音声（順次再生）
            // durationInFrames: 75,           // 省略すると音声ファイルから自動取得
            delayFrames: 10,                   // 前の音声終了後10フレーム待ってから再生
            volume: 1.0
          }
        }
      ]
    },

    // ----------------------------------------
    // シーン2: 画像スライドの例（5秒～10秒）
    // ----------------------------------------
    {
      id: "scene2",
      // startFrameとdurationInFramesは省略すると自動計算されます

      slide: {
        type: 'image',
        title: '図解',
        imagePath: '/slides/diagram.png',
        backgroundColor: '#16213e'
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: '画像を使った説明ができます'
          },
          audio: {
            voiceover: "/audio/scene2.mp3"
            // durationInFrames, volume, delayFramesは省略可能
          }
        }
      ]
    },

    // ----------------------------------------
    // シーン3: PDFスライドの例（10秒～15秒）
    // ----------------------------------------
    {
      id: "scene3",

      slide: {
        type: 'pdf',
        title: '資料',
        pdfPath: '/pdfs/presentation.pdf',
        pdfPage: 1             // 表示するPDFのページ番号
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: 'PDFの資料も表示できます'
          },
          audio: {
            voiceover: "/audio/scene3.mp3"
          }
        }
      ]
    },

    // ----------------------------------------
    // シーン4: 動画スライドの例（15秒～20秒）
    // ----------------------------------------
    {
      id: "scene4",

      slide: {
        type: 'video',
        title: 'デモ動画',
        videoPath: '/videos/demo.mp4'  // 動画ファイルのパス（ループ再生されます）
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: '動画も表示できます。動画はループ再生されます。'
          },
          audio: {
            voiceover: "/audio/scene4.mp3"
          }
        }
      ]
    },

    // ----------------------------------------
    // シーン5: エンディング（20秒～25秒）
    // ----------------------------------------
    {
      id: "ending",

      slide: {
        type: 'text',
        title: 'まとめ',
        content: 'ご視聴\nありがとうございました',
        fontSize: 75,
        backgroundColor: '#0f3460',
        textColor: '#ffffff'
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: 'チャンネル登録をお願いします！',
            fontSize: 28
          },
          audio: {
            voiceover: "/audio/scene4.mp3"
          }
        }
      ]
    }
  ]
};

// ========================================
// フレーム計算の参考
// ========================================
// fps: 30の場合
// - 1秒 = 30フレーム
// - 5秒 = 150フレーム
// - 10秒 = 300フレーム
// - 20秒 = 600フレーム
//
// シーンの開始フレーム計算:
// - シーン1: 0フレーム（0秒）
// - シーン2: 150フレーム（5秒）
// - シーン3: 300フレーム（10秒）
// - シーン4: 450フレーム（15秒）

// ========================================
// 推奨ファイルサイズ・形式
// ========================================
// キャラクター画像:
//   - 幅: 800-1000px
//   - 高さ: 1200-1600px
//   - 形式: PNG（透過推奨）
//
// 背景画像:
//   - サイズ: 1920 × 1080px
//   - 形式: PNG, JPG
//
// 音声:
//   - 形式: MP3（推奨）
//   - ビットレート: 128kbps以上

// ========================================
// キャラクター配置のカスタマイズ例
// ========================================
// 左側に配置:
//   layout: { width: '40%', height: '90%', bottom: '0', left: '50px' }
//
// 右側にはみ出す:
//   layout: { width: '50%', height: '100%', bottom: '-50px', right: '-100px' }
//
// 小さく表示:
//   layout: { width: '30%', height: '70%', bottom: '10px', right: '10px' }
//
// 画面いっぱい:
//   layout: { width: '50%', height: '100%', bottom: '0', right: '0' }
