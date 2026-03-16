# Remotion 解説動画作成システム

Remotionを使用した自動動画作成システムです。台本やキャラクター設定をJSON/TypeScriptで記述することで、解説動画を自動生成できます。

## 特徴

- **3分割レイアウト**: スライド、字幕、キャラクター立ち絵
- **自動瞬きアニメーション**: キャラクターがリアルに瞬きします
- **口パクアニメーション**: 音声再生時にキャラクターが口を動かします
- **音声対応**: BGMとシーン毎のナレーション設定
- **PDF表示**: PDFをスライドとして表示可能
- **柔軟なカスタマイズ**: 背景、色、フォントなど自由に設定

## 画面構成

```
┌─────────────────────────────────────────┬────────┐
│                                         │        │
│           スライドエリア                │        │
│        (テキスト/画像/PDF)              │ キャラ │
│                                         │ クター │
│─────────────────────────────────────────┤        │
│    字幕エリア                           │        │
└─────────────────────────────────────────┴────────┘
```

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係をインストール
npm install

# プレビューを起動
npm start

# 動画をレンダリング
npm run build
```

## プロジェクト構造

```
movie/
├── public/
│   ├── audio/          # 音声ファイル (MP3)
│   ├── backgrounds/    # 背景画像
│   ├── characters/     # キャラクター画像
│   ├── pdfs/          # PDFファイル
│   └── slides/        # スライド用画像
├── src/
│   ├── config.ts      # 動画設定ファイル
│   ├── ExplanationVideo.tsx  # メインコンポーネント
│   ├── PdfSlide.tsx   # PDF表示コンポーネント
│   ├── useBlinkAnimation.ts  # 瞬きアニメーション
│   ├── useMouthAnimation.ts  # 口パクアニメーション
│   └── Video.tsx      # Remotion設定
├── config.template.ts  # 設定ひな型（詳細版）
├── config.simple.ts    # 設定ひな型（シンプル版）
├── package.json
└── remotion.config.ts
```

## 使い方

### クイックスタート（ひな型を使う）

プロジェクトには2種類の設定ひな型が用意されています。

#### 方法1: 詳細版テンプレート（推奨）

すべての機能を含む完全なテンプレートです。

```bash
# テンプレートをコピー
cp config.template.ts my-video.config.ts

# my-video.config.ts を編集
# - タイトル、シーン内容を変更
# - 不要なシーンを削除または追加
```

**含まれる機能:**
- BGM設定
- 4つのシーン例（テキスト/画像/PDF/エンディング）
- 音声設定
- 詳細なコメント・説明

#### 方法2: シンプル版テンプレート

最小限の設定のみで、すぐに始められます。

```bash
# シンプル版をコピー
cp config.simple.ts my-simple.config.ts

# 基本的な2シーンのみ
# BGM・音声なし
```

#### テンプレートの使用

作成した設定ファイルを `src/Video.tsx` で読み込みます：

```typescript
// src/Video.tsx
import { videoConfig } from '../my-video.config';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyVideo"
      component={ExplanationVideo}
      durationInFrames={videoConfig.durationInFrames}
      fps={videoConfig.fps}
      width={videoConfig.width}
      height={videoConfig.height}
      defaultProps={{ config: videoConfig }}
    />
  );
};
```

### 1. アセットの準備

#### キャラクター画像

**瞬きのみの場合（2種類）:**
```
public/characters/
├── narrator-eyes-open-mouth-closed.png   # 目を開いている・口を閉じている（通常）
└── narrator-eyes-closed-mouth-closed.png # 目を閉じている・口を閉じている
```

**口パク機能を使う場合（4種類）:**
```
public/characters/
├── narrator-eyes-open-mouth-closed.png   # 目を開いている・口を閉じている
├── narrator-eyes-open-mouth-open.png     # 目を開いている・口を開いている
├── narrator-eyes-closed-mouth-closed.png # 目を閉じている・口を閉じている
└── narrator-eyes-closed-mouth-open.png   # 目を閉じている・口を開いている
```

**推奨サイズ**: 幅800-1000px、高さ1200-1600px（縦長、透過PNG）

#### 背景画像
```
public/backgrounds/
└── tech-background.png
```

**推奨サイズ**: 1920 × 1080px

#### 音声ファイル（MP3のみ）
```
public/audio/
├── bgm.mp3        # BGM
├── scene1.mp3     # シーン1のナレーション
└── scene2.mp3     # シーン2のナレーション
```

### 2. 設定ファイルの編集

`src/config.ts`を編集して動画の内容を設定します。

```typescript
export const sampleConfig: VideoConfig = {
  title: "解説動画タイトル",
  fps: 30,
  durationInFrames: 600, // 20秒
  width: 1920,
  height: 1080,

  // 背景画像
  backgroundImage: "/backgrounds/tech-background.png",

  // BGM
  backgroundMusic: {
    path: "/audio/bgm.mp3",
    volume: 0.3  // 30%の音量
  },

  // キャラクター定義
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
      }
    }
  },

  // シーン定義
  scenes: [
    {
      id: "scene1",
      startFrame: 0,
      durationInFrames: 150,  // 5秒

      // スライド
      slide: {
        type: 'text',
        title: 'イントロ',
        content: 'Remotionとは？',
        backgroundColor: '#1a1a2e',
        textColor: '#ffffff'
      },

      // 字幕
      subtitle: {
        text: 'Remotionはコードで動画を作成できるフレームワークです',
        fontSize: 24
      },

      // キャラクター
      character: {
        id: 'narrator'
      },

      // 音声
      audio: {
        voiceover: "/audio/scene1.mp3",
        volume: 1.0
      }
    }
  ]
};
```

### 3. 口パク機能（オプション）

音声再生時にキャラクターが自動で口を動かします。

#### 設定方法

`mouthImages`に4枚の画像を設定：

```typescript
characters: {
  narrator: {
    name: "ナレーター",
    defaultImage: "/characters/narrator-eyes-open-mouth-closed.png",
    blinkImages: {
      closed: "/characters/narrator-eyes-closed-mouth-closed.png"
    },
    mouthImages: {
      eyesOpenMouthOpen: "/characters/narrator-eyes-open-mouth-open.png",
      eyesOpenMouthClosed: "/characters/narrator-eyes-open-mouth-closed.png",
      eyesClosedMouthOpen: "/characters/narrator-eyes-closed-mouth-open.png",
      eyesClosedMouthClosed: "/characters/narrator-eyes-closed-mouth-closed.png"
    }
  }
}
```

口パク機能を使わない場合は、`mouthImages`を省略してください。

### 4. キャラクターの配置調整

キャラクターの位置とサイズは`layout`で自由に調整できます。

```typescript
characters: {
  narrator: {
    name: "ナレーター",
    defaultImage: "/characters/narrator-eyes-open-mouth-closed.png",
    blinkImages: {
      closed: "/characters/narrator-eyes-closed-mouth-closed.png"
    },
    // 位置・サイズの調整
    layout: {
      width: '45%',      // 画面幅の45%
      height: '95%',     // 画面高さの95%
      bottom: '0',       // 下端に配置
      right: '-50px'     // 右端から-50px（少しはみ出す）
    }
  }
}
```

#### 配置のバリエーション

**左側に配置:**
```typescript
layout: {
  width: '40%',
  height: '90%',
  bottom: '0',
  left: '50px'        // 左から50px
}
```

**画面いっぱいに表示:**
```typescript
layout: {
  width: '50%',
  height: '100%',
  bottom: '0',
  right: '0'
}
```

**小さく表示:**
```typescript
layout: {
  width: '30%',
  height: '70%',
  bottom: '10px',
  right: '10px'
}
```

**迫力のある配置（はみ出し）:**
```typescript
layout: {
  width: '50%',
  height: '100%',
  bottom: '-50px',    // 下にはみ出す
  right: '-100px'     // 右にはみ出す
}
```

> **注意**: `layout`を省略すると、デフォルト設定が使用されます。

### 5. スライドの種類

#### テキストスライド
```typescript
slide: {
  type: 'text',
  title: '副題',
  content: 'メインテキスト',
  backgroundColor: '#1a1a2e',
  textColor: '#ffffff'
}
```

#### 画像スライド
```typescript
slide: {
  type: 'image',
  title: '図解',
  imagePath: '/slides/diagram.png'
}
```

#### PDFスライド
```typescript
slide: {
  type: 'pdf',
  title: '資料',
  pdfPath: '/pdfs/presentation.pdf',
  pdfPage: 1  // ページ番号
}
```

### 6. プレビュー

```bash
npm start
```

ブラウザで `http://localhost:3000` を開きます。

### 7. レンダリング

```bash
# デフォルト設定でレンダリング
npm run build

# または詳細指定
npx remotion render src/index.ts ExplanationVideo out/video.mp4
```

## フレーム計算

- **FPS**: 30の場合、1秒 = 30フレーム
- **5秒のシーン**: `durationInFrames: 150`
- **開始位置**:
  - シーン1: `startFrame: 0`
  - シーン2: `startFrame: 150` (5秒後)
  - シーン3: `startFrame: 300` (10秒後)

## トラブルシューティング

### 画像が表示されない
- ファイル名が設定ファイルと一致しているか確認
- `public/`フォルダに正しく配置されているか確認
- ブラウザのコンソールでエラーを確認

### 音声が再生されない
- **MP3形式のみ対応**
- ファイルパスが正しいか確認
- 音量設定（0.0-1.0）を確認

### PDFが表示されない
- ライブラリが正しくインストールされているか確認
- PDFファイルが破損していないか確認

## ライセンス

ISC

## 開発者向け

### 主要な技術スタック
- [Remotion](https://www.remotion.dev/) - プログラマブル動画作成
- React - UIフレームワーク
- TypeScript - 型安全性
- react-pdf - PDF表示

### カスタマイズ

レイアウトや見た目を変更する場合は、`src/ExplanationVideo.tsx`を編集してください。

### 新機能の追加

1. `src/config.ts`で型定義を追加
2. `src/ExplanationVideo.tsx`でUIロジックを実装
3. 必要に応じてコンポーネントを分割

## サポート

問題が発生した場合は、Issueを作成してください。
