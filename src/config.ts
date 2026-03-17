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
  durationInFrames?: number; // 省略時は全シーンの合計から自動計算
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
  startFrame?: number; // 省略時は前のシーンの終了位置から自動計算
  durationInFrames?: number; // 省略時はセグメント内の音声の合計から自動計算

  // スライド部分
  slide: {
    type: 'text' | 'image' | 'pdf' | 'video';
    title?: string; // 副題（スライド左上に表示）
    content?: string;
    fontSize?: number; // テキストのフォントサイズ（type: 'text'の場合）
    imagePath?: string;
    pdfPath?: string; // PDFファイルのパス
    pdfPage?: number; // 表示するPDFのページ番号（1から開始）
    videoPath?: string; // 動画ファイルのパス（type: 'video'の場合）
    backgroundColor?: string;
    textColor?: string;
    backgroundImage?: string; // スライド専用の背景画像
  };

  // キャラクター部分
  character: {
    id: string; // charactersオブジェクトのキーを参照
  };

  // セグメント（字幕と音声のペア、複数設定可能で順次再生）
  segments?: {
    subtitle?: {
      text: string;
      color?: string;
      fontSize?: number;
    };
    audio?: {
      voiceover: string;        // ナレーション音声ファイルのパス
      durationInFrames?: number; // この音声の長さ（フレーム数、省略時は自動計算）
      delayFrames?: number;     // 開始遅延（フレーム数、デフォルト: 0）
      volume?: number;          // 音量 (0.0 - 1.0)
    };
  }[];
}

// ========================================
// Character: キャラクターの設定
// ========================================
export interface Character {
  name: string;
  defaultImage: string; // デフォルト画像のパス（目を開いている・口を閉じている状態）

  // 瞬き用の画像（口は閉じている状態）
  blinkImages?: {
    closed: string;     // 目を閉じている・口を閉じている
  };

  // 口パク用の画像（音声再生時に使用）
  // 瞬きと口パクを組み合わせた4パターンの画像
  mouthImages?: {
    eyesOpenMouthOpen: string;       // 目を開いている・口を開いている
    eyesOpenMouthClosed: string;     // 目を開いている・口を閉じている（defaultImageと同じでOK）
    eyesClosedMouthOpen: string;     // 目を閉じている・口を開いている
    eyesClosedMouthClosed: string;   // 目を閉じている・口を閉じている（blinkImages.closedと同じでOK）
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
 * remotion-explanation-generatorの解説動画
 *
 * 動画の構成:
 * - シーン1 : タイトル
 * - シーン2 : このツールの概要
 * - シーン3 (10-15秒: 3つの特徴
 * - シーン4 : 設定ファイルの説明
 * - シーン5 : 使い方の流れ
 * - シーン6 : まとめ
 *
 * 総尺: 約30秒
 */
export const sampleConfig: VideoConfig = {
  // ----------------------------------------
  // 基本設定
  // ----------------------------------------
  title: "remotion-explanation-generator解説",
  fps: 30,                      // 30フレーム/秒
  // durationInFramesは省略すると全シーンの合計から自動計算されます
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
    volume: 0.1                 // 30%の音量
  },

  // ----------------------------------------
  // キャラクター定義
  // ----------------------------------------
  characters: {
    narrator: {
      name: "ナレーター",
      defaultImage: "/characters/narrator-eyes-open-mouth-closed.png",
      blinkImages: {
        closed: "/characters/narrator-eyes-closed-mouth-close.png"  // ファイル名のtypo: close
      },
      // 口パク用の画像（4パターン）
      mouthImages: {
        eyesOpenMouthOpen: "/characters/narrator-eyes-open-mouth-open.png",
        eyesOpenMouthClosed: "/characters/narrator-eyes-open-mouth-closed.png",
        eyesClosedMouthOpen: "/characters/narrator-eyes-closed-mouth-open.png",
        eyesClosedMouthClosed: "/characters/narrator-eyes-closed-mouth-closed.png"  // ファイル名のtypo: close
      },
      // 表示位置とサイズのカスタマイズ
      layout: {
        width: '45%',         // 画面幅の45%
        height: '150%',       // 画面高さの150%
        bottom: '-800px',     // 画面下端に配置
        right: '-160px'       // 右端から-160px
      }
    }
  },

  // ----------------------------------------
  // シーン構成
  // ----------------------------------------
  scenes: [
    // ========================================
    // シーン1: タイトル
    // ========================================
    {
      id: "scene1",
      startFrame: 0,
      // durationInFramesは省略すると音声の長さから自動計算されます

      slide: {
        type: 'text',
        content: 'remotion-explanation-generator',
        fontSize: 70,
        backgroundColor: '#16213e',
        textColor: '#ffffff'
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: 'このプログラムについて説明します。',
            fontSize: 28
          },
          audio: {
            voiceover: "/audio/scene1.wav",
            // durationInFramesは省略すると自動計算されます
            volume: 1.0
          }
        }
      ]
    },

    // ========================================
    // シーン2: このツールの概要
    // ========================================
    {
      id: "scene2",
      // startFrameとdurationInFramesは自動計算されます

      slide: {
        type: 'text',
        title: '概要',
        content: 'Remotionベースの\n解説動画作成システム',
        fontSize: 60,
        backgroundColor: '#16213e',
        textColor: '#ffffff'
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: 'このプログラムは、Remotionベースの解説動画作成システムです。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene2_1.wav",
            volume: 1.0
          }
        },
        {
          subtitle: {
            text: 'TypeScript設定ファイルで台本を記述すると、自動で動画が生成されます',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene2_2.wav",
            delayFrames: 20,
            volume: 1.0
          }
        }
      ]
    },

    // ========================================
    // シーン3: 3つの特徴の提示
    // ========================================
    {
      id: "scene3",

      slide: {
        type: 'text',
        title: '3つの特徴',
        content: '① 3分割レイアウト\n\n② 自動アニメーション\n\n③ 音声の自動同期',
        fontSize: 50,
        backgroundColor: '#16213e',
        textColor: '#ffffff'
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: 'このシステムには、3つの大きな特徴があります。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene3.wav",
            volume: 1.0
          }
        }
      ]
    },

    // ========================================
    // シーン4: 特徴1 - 3分割レイアウト
    // ========================================
    {
      id: "scene4",

      slide: {
        type: 'text',
        title: '特徴①',
        content: '3分割レイアウト\n\nスライド・字幕・キャラクター',
        fontSize: 55,
        backgroundColor: '#16213e',
        textColor: '#ffffff'
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: '1つ目の特徴は、スライド、字幕、キャラクターの3画面構成です。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene4_1.wav",
            delayFrames: 20,
            volume: 1.0
          }
        },
      ]
    },
    // ========================================
    // シーン5: 特徴1 - 3分割レイアウト2
    // ========================================
    {
      id: "scene5",

      slide: {
        type: 'image',
        title: '特徴①',
        imagePath: '/images/scene3_2.png',
      },
    
      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: '左側にスライド、下部に字幕、右側にキャラクターを配置しています。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene4_2.wav",
            delayFrames: 20,
            volume: 1.0
          }
        },
        {
          subtitle: {
            text: '見やすいレイアウトで、解説動画に最適な構成となっています。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene4_3.wav",
            delayFrames: 20,
            volume: 1.0
          }
        }
      ]
    },

    // ========================================
    // シーン6: 特徴2 - 自動アニメーション1
    // ========================================
    {
      id: "scene6",

      slide: {
        type: 'text',
        title: '特徴②',
        content: '自動アニメーション\n\n瞬き・口パク',
        fontSize: 55,
        backgroundColor: '#1a1a2e',
        textColor: '#ffffff'
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: '2つ目の特徴は、キャラクターの瞬きと口パクが自動でアニメーションすることです。',
            fontSize: 25
          },
          audio: {
            voiceover: "/audio/scene6.wav",
            volume: 1.0
          }
        },
      ]
    },
    // ========================================
    // シーン7: 特徴2 - 自動アニメーション2
    // ========================================
    {
      id: "scene7",
      slide: {
        type: 'video',
        title: '特徴②',
        videoPath: '/videos/scene7.mp4',
      },
      character: {
        id: 'narrator'
      },
      segments: [
        {
          subtitle: {
            text: '瞬きは自然なタイミングで自動的に行われます。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene7_1.wav",
            volume: 1.0
          }
        },
        {
          subtitle: {
            text: '口パクは、音声が再生されている間だけ、リアルタイムで動きます。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene7_2.wav",
            delayFrames: 20,
            volume: 1.0
          }
        },
        {
          subtitle: {
            text: '音声の再生タイミングと完全に同期するので、とても自然です。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene7_3.wav",
            delayFrames: 20,
            volume: 1.0
          }
        }
      ]
    },
    // ========================================
    // シーン8: 特徴3 - 音声の自動同期
    // ========================================
    {
      id: "scene8",

      slide: {
        type: 'text',
        title: '特徴③',
        content: '音声の自動同期\n\n時間設定が不要',
        fontSize: 55,
        backgroundColor: '#16213e',
        textColor: '#ffffff'
      },

      character: {
        id: 'narrator'
      },

      segments: [
        {
          subtitle: {
            text: '3つ目の特徴は、音声ファイルの長さを自動で判定することです。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene8_1.wav",
            delayFrames: 20,
            volume: 1.0
          }
        },
        {
          subtitle: {
            text: '音声ファイルを指定するだけで、長さを自動取得します。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene8_2.wav",
            delayFrames: 20,
            volume: 1.0
          }
        },
        {
          subtitle: {
            text: '各スライドの表示時間や、字幕の表示時間などはセグメント内の音声ファイルの長さから自動計算されます。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene8_3.wav",
            delayFrames: 20,
            volume: 1.0
          }
        },
        {
          subtitle: {
            text: '動画全体の長さまで、すべて自動で決まるので、手動で時間を計算する必要はありません。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene8_4.wav",
            delayFrames: 20,
            volume: 1.0
          }
        },
        {
          subtitle: {
            text: 'また音声ファイルを差し替えても、自動で調整されるので便利です。',
            fontSize: 26
          },
          audio: {
            voiceover: "/audio/scene8_5.wav",
            delayFrames: 20,
            volume: 1.0
          }
        }
      ]
    },
  ]
};

