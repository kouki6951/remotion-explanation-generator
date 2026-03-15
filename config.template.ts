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
  durationInFrames: 600,      // 総フレーム数（600 = 20秒）
  width: 1920,                // 動画の幅
  height: 1080,               // 動画の高さ

  // ========================================
  // 背景画像（オプション）
  // ========================================
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

      // 目を開いている状態の画像（通常時に表示）
      defaultImage: "/characters/narrator-open.png",

      // 瞬き用の画像（オプション）
      blinkImages: {
        halfClosed: "/characters/narrator-half.png",
        closed: "/characters/narrator-closed.png"
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
      startFrame: 0,           // 開始フレーム（0 = 最初から）
      durationInFrames: 150,   // このシーンの長さ（150 = 5秒）

      // スライド設定
      slide: {
        type: 'text',          // 'text' | 'image' | 'pdf'
        title: 'イントロ',     // 副題（左上に表示、オプション）
        content: 'タイトル',   // メインコンテンツ
        backgroundColor: '#1a1a2e',
        textColor: '#ffffff'
        // backgroundImage: '/slides/bg.png'  // スライド専用背景（オプション）
      },

      // 字幕設定
      subtitle: {
        text: 'ここに字幕テキストを入力します',
        color: '#ffffff',      // オプション（デフォルト: 白）
        fontSize: 24           // オプション（デフォルト: 24）
      },

      // キャラクター設定
      character: {
        id: 'narrator'         // charactersで定義したID
      },

      // 音声設定（オプション）
      audio: {
        voiceover: "/audio/scene1.mp3",  // ナレーション音声（MP3推奨）
        volume: 1.0                       // 音量 0.0～1.0
      }
    },

    // ----------------------------------------
    // シーン2: 画像スライドの例（5秒～10秒）
    // ----------------------------------------
    {
      id: "scene2",
      startFrame: 150,         // 5秒後から開始
      durationInFrames: 150,   // 5秒間

      slide: {
        type: 'image',
        title: '図解',
        imagePath: '/slides/diagram.png',
        backgroundColor: '#16213e'
      },

      subtitle: {
        text: '画像を使った説明ができます'
      },

      character: {
        id: 'narrator'
      },

      audio: {
        voiceover: "/audio/scene2.mp3",
        volume: 1.0
      }
    },

    // ----------------------------------------
    // シーン3: PDFスライドの例（10秒～15秒）
    // ----------------------------------------
    {
      id: "scene3",
      startFrame: 300,         // 10秒後から開始
      durationInFrames: 150,   // 5秒間

      slide: {
        type: 'pdf',
        title: '資料',
        pdfPath: '/pdfs/presentation.pdf',
        pdfPage: 1             // 表示するPDFのページ番号
      },

      subtitle: {
        text: 'PDFの資料も表示できます'
      },

      character: {
        id: 'narrator'
      },

      audio: {
        voiceover: "/audio/scene3.mp3",
        volume: 1.0
      }
    },

    // ----------------------------------------
    // シーン4: エンディング（15秒～20秒）
    // ----------------------------------------
    {
      id: "ending",
      startFrame: 450,         // 15秒後から開始
      durationInFrames: 150,   // 5秒間

      slide: {
        type: 'text',
        title: 'まとめ',
        content: 'ご視聴ありがとうございました',
        backgroundColor: '#0f3460',
        textColor: '#ffffff'
      },

      subtitle: {
        text: 'チャンネル登録をお願いします！',
        fontSize: 28
      },

      character: {
        id: 'narrator'
      },

      audio: {
        voiceover: "/audio/scene4.mp3",
        volume: 1.0
      }
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
