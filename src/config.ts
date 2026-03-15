/**
 * ========================================
 * 動画設定の型定義
 * ========================================
 * このファイルには動画作成に必要な型定義とサンプル設定が含まれています
 */

// ========================================
// VideoConfig: 動画全体の設定
// ========================================
export interface VideoConfig {
  // 動画の基本設定
  title: string;
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;

  // 背景画像設定
  backgroundImage?: string;

  // BGM設定
  backgroundMusic?: {
    path: string;   // BGMファイルのパス
    volume?: number; // 音量 (0.0 - 1.0)
  };

  // シーンの配列
  scenes: Scene[];

  // キャラクター設定
  characters: {
    [key: string]: Character;
  };
}

// ========================================
// Scene: 各シーンの設定
// ========================================
export interface Scene {
  id: string;
  startFrame: number;
  durationInFrames: number;

  // スライド部分
  slide: {
    type: 'text' | 'image' | 'pdf';
    title?: string; // 副題（スライド左上に表示）
    content?: string;
    imagePath?: string;
    pdfPath?: string; // PDFファイルのパス
    pdfPage?: number; // 表示するPDFのページ番号（1から開始）
    backgroundColor?: string;
    textColor?: string;
    backgroundImage?: string; // スライド専用の背景画像
  };

  // 字幕部分
  subtitle: {
    text: string;
    color?: string;
    fontSize?: number;
  };

  // キャラクター部分
  character: {
    id: string; // charactersオブジェクトのキーを参照
  };

  // 音声設定
  audio?: {
    voiceover?: string; // ナレーション音声ファイルのパス
    volume?: number;    // 音量 (0.0 - 1.0)
  };
}

// ========================================
// Character: キャラクターの設定
// ========================================
export interface Character {
  name: string;
  defaultImage: string; // デフォルト画像のパス（瞬き用の目を開いている画像）

  // 瞬き用の画像
  blinkImages?: {
    halfClosed: string; // 目が半開き
    closed: string;     // 目を閉じている
  };

  // 表示位置・サイズの設定
  layout?: {
    width?: string;      // 幅（例: '45%', '500px'）
    height?: string;     // 高さ（例: '95%', '800px'）
    bottom?: string;     // 下からの位置（例: '0', '10px'）
    right?: string;      // 右からの位置（例: '-50px', '20px'）
    left?: string;       // 左からの位置（例: '50px'）
  };
}

/**
 * ========================================
 * サンプル動画設定
 * ========================================
 * Remotionの機能を紹介するデモ動画の設定例
 *
 * 動画の構成:
 * - シーン1 (0-4.3秒): Remotionの紹介（テキストスライド）
 * - シーン2 (4.3-8.6秒): React活用の説明（テキストスライド）
 * - シーン3 (8.6-13秒): PDF表示のデモ（PDFスライド）
 *
 * 総尺: 約13秒
 */
export const sampleConfig: VideoConfig = {
  // ----------------------------------------
  // 基本設定
  // ----------------------------------------
  title: "Remotion解説動画サンプル",
  fps: 30,                      // 30フレーム/秒
  durationInFrames: 390,        // 総フレーム数（390 = 13秒）
  width: 1920,                  // フルHD
  height: 1080,

  // ----------------------------------------
  // 背景設定
  // ----------------------------------------
  backgroundImage: "/backgrounds/tech-background.png",

  // ----------------------------------------
  // BGM設定
  // ----------------------------------------
  backgroundMusic: {
    path: "/audio/bgm.mp3",
    volume: 0.3                 // 30%の音量
  },

  // ----------------------------------------
  // キャラクター定義
  // ----------------------------------------
  characters: {
    narrator: {
      name: "ナレーター",
      defaultImage: "/characters/narrator-eyes-open.png",
      blinkImages: {
        halfClosed: "/characters/narrator-eyes-half.png",
        closed: "/characters/narrator-yes-closed.png"
      },
      // 表示位置とサイズのカスタマイズ
      layout: {
        width: '45%',         // 画面幅の45%
        height: '150%',        // 画面高さの95%
        bottom: '-800px',          // 画面下端に配置
        right: '-160px'        // 右端から-50px（少しはみ出す）
      }
    }
  },

  // ----------------------------------------
  // シーン構成
  // ----------------------------------------
  scenes: [
    // ========================================
    // シーン1: Remotionの紹介
    // ========================================
    {
      id: "scene1",
      startFrame: 0,              // 0秒から開始
      durationInFrames: 130,      // 約4.3秒間

      // スライド: テキスト表示
      slide: {
        type: 'text',
        title: 'イントロ',        // 左上の副題
        content: 'Remotionとは？', // メインテキスト
        backgroundColor: '#1a1a2e',
        textColor: '#ffffff'
      },

      // 字幕
      subtitle: {
        text: 'Remotionはコードで動画を作成できるフレームワークです',
        color: '#ffffff',
        fontSize: 32
      },

      // キャラクター
      character: {
        id: 'narrator'
      },

      // 音声
      audio: {
        voiceover: "/audio/scene1.wav",
        volume: 1.0
      }
    },
    // ========================================
    // シーン2: React活用の説明
    // ========================================
    {
      id: "scene2",
      startFrame: 130,            // 4.3秒から開始
      durationInFrames: 130,      // 約4.3秒間

      // スライド: テキスト表示
      slide: {
        type: 'text',
        title: '機能紹介',
        content: 'Reactを使って動画を作成',
        backgroundColor: '#16213e',
        textColor: '#ffffff'
      },

      // 字幕
      subtitle: {
        text: 'Reactコンポーネントを使って柔軟に動画を構築できます',
        color: '#ffffff',
        fontSize: 32
      },

      // キャラクター
      character: {
        id: 'narrator'
      },

      // 音声
      audio: {
        voiceover: "/audio/scene2.wav",
        volume: 1.0
      }
    },
    // ========================================
    // シーン3: PDF表示のデモ
    // ========================================
    {
      id: "scene3",
      startFrame: 260,            // 8.6秒から開始
      durationInFrames: 130,      // 約4.3秒間

      // スライド: PDF表示
      slide: {
        type: 'pdf',
        pdfPath: "/pdfs/presentation.pdf",
        pdfPage: 1                // 1ページ目を表示
      },

      // 字幕
      subtitle: {
        text: 'このようにPDFを表示できます',
        color: '#ffffff',
        fontSize: 32
      },

      // キャラクター
      character: {
        id: 'narrator'
      }
      // 音声: このシーンは音声なし
    }
  ]
};

