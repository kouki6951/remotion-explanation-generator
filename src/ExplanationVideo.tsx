import React from 'react';
import { AbsoluteFill, useCurrentFrame, staticFile, Audio, Sequence } from 'remotion';
import { VideoConfig, Scene } from './config';
import { useBlinkAnimation } from './useBlinkAnimation';
import { useMouthAnimation } from './useMouthAnimation';
import { PdfSlide } from './PdfSlide';

interface ExplanationVideoProps {
  config: VideoConfig;
}

export const ExplanationVideo: React.FC<ExplanationVideoProps> = ({ config }) => {
  const frame = useCurrentFrame();

  // 現在のフレームに対応するシーンを取得
  const currentScene = config.scenes.find(
    (scene) =>
      frame >= scene.startFrame &&
      frame < scene.startFrame + scene.durationInFrames
  );

  if (!currentScene) {
    return <AbsoluteFill style={{ backgroundColor: '#000' }} />;
  }

  return (
    <AbsoluteFill>
      {/* BGM */}
      {config.backgroundMusic && (
        <Audio
          src={staticFile(config.backgroundMusic.path)}
          volume={config.backgroundMusic.volume ?? 0.5}
          loop
        />
      )}

      {/* シーン毎の音声 */}
      {config.scenes.map((scene) => (
        scene.audio?.voiceover && (
          <Sequence
            key={`audio-${scene.id}`}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
          >
            <Audio
              src={staticFile(scene.audio.voiceover)}
              volume={scene.audio.volume ?? 1.0}
            />
          </Sequence>
        )
      ))}

      {/* 背景画像 */}
      {config.backgroundImage && (
        <AbsoluteFill>
          <img
            src={staticFile(config.backgroundImage)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            alt="Background"
          />
        </AbsoluteFill>
      )}

      {/* スライドエリアと字幕 */}
      <AbsoluteFill>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* スライドエリア */}
          <SlideArea scene={currentScene} />

          {/* 字幕エリア（スライドの下） */}
          <SubtitleArea scene={currentScene} />
        </div>
      </AbsoluteFill>

      {/* キャラクターエリア（最前面） */}
      <AbsoluteFill>
        <CharacterArea scene={currentScene} config={config} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// スライドエリアコンポーネント
const SlideArea: React.FC<{ scene: Scene }> = ({ scene }) => {
  const { slide } = scene;

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: 'calc(75% - 40px)', // 幅75%に拡大
        height: 'calc(82% - 40px)', // 高さも拡大
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}
    >
      {/* スライド背景画像またはカラー */}
      {slide.backgroundImage ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '15px'
          }}
        >
          <img
            src={staticFile(slide.backgroundImage)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            alt="Slide background"
          />
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: slide.backgroundColor || 'rgba(26, 26, 46, 0.9)',
            borderRadius: '15px',
            border: '3px solid rgba(255, 255, 255, 0.2)'
          }}
        />
      )}

      {/* 副題（左上） */}
      {slide.title && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '25px',
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '8px 20px',
            borderRadius: '5px',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <span
            style={{
              color: slide.textColor || '#ffffff',
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {slide.title}
          </span>
        </div>
      )}

      {/* コンテンツ */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {slide.type === 'text' && (
          <h1
            style={{
              color: slide.textColor || '#ffffff',
              fontSize: '80px',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 0,
              fontFamily: 'Arial, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {slide.content}
          </h1>
        )}
        {slide.type === 'image' && slide.imagePath && (
          <img
            src={staticFile(slide.imagePath)}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
            alt="Slide"
          />
        )}
        {slide.type === 'pdf' && slide.pdfPath && (
          <PdfSlide
            pdfPath={slide.pdfPath}
            pageNumber={slide.pdfPage || 1}
          />
        )}
      </div>
    </div>
  );
};

// キャラクターエリアコンポーネント
const CharacterArea: React.FC<{ scene: Scene; config: VideoConfig }> = ({
  scene,
  config
}) => {
  const frame = useCurrentFrame();
  const character = config.characters[scene.character.id];
  const blinkState = useBlinkAnimation(config.fps);

  // 現在のシーンで音声が再生されているかチェック
  // Sequence内でレンダリングされているため、frameは0から始まる
  const isAudioPlaying = Boolean(scene.audio?.voiceover);
  const mouthState = useMouthAnimation(isAudioPlaying);

  // 瞬きと口パクを組み合わせて画像を選択
  let displayImagePath = character.defaultImage; // デフォルト: 目を開いている・口を閉じている

  // 口パク画像が設定されている場合
  if (character.mouthImages) {
    if (mouthState === 'open' && blinkState === 'open') {
      // 目を開いて・口を開いている
      displayImagePath = character.mouthImages.eyesOpenMouthOpen;
    } else if (mouthState === 'open' && blinkState === 'closed') {
      // 目を閉じて・口を開いている
      displayImagePath = character.mouthImages.eyesClosedMouthOpen;
    } else if (mouthState === 'closed' && blinkState === 'open') {
      // 目を開いて・口を閉じている
      displayImagePath = character.mouthImages.eyesOpenMouthClosed;
    } else {
      // 目を閉じて・口を閉じている
      displayImagePath = character.mouthImages.eyesClosedMouthClosed;
    }
  } else {
    // 口パク画像が設定されていない場合は瞬きのみ
    if (character.blinkImages && blinkState === 'closed') {
      displayImagePath = character.blinkImages.closed;
    }
  }

  // レイアウト設定（デフォルト値）
  const layout = character.layout || {};
  const width = layout.width || '45%';
  const height = layout.height || '95%';
  const bottom = layout.bottom || '0';
  const right = layout.right !== undefined ? layout.right : '-50px';
  const left = layout.left;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottom,
        right: left === undefined ? right : undefined,
        left: left,
        width: width,
        height: height,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 10 // 最前面
      }}
    >
      {/* キャラクター画像 */}
      <img
        src={staticFile(displayImagePath)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom',
          filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
        }}
        alt={character.name}
        onError={(e) => {
          // 画像読み込み失敗時のプレースホルダー
          const target = e.target as HTMLImageElement;
          const parent = target.parentElement;

          // 既にプレースホルダーが存在する場合は何もしない
          if (parent && !parent.querySelector('.character-placeholder')) {
            target.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'character-placeholder';
            placeholder.style.cssText = `
              width: 400px;
              height: 600px;
              background-color: rgba(42, 63, 95, 0.5);
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 24px;
              text-align: center;
              padding: 20px;
              border: 2px solid rgba(255,255,255,0.3);
            `;
            placeholder.innerHTML = `${character.name}`;
            parent.appendChild(placeholder);
          }
        }}
      />
    </div>
  );
};

// 字幕エリアコンポーネント
const SubtitleArea: React.FC<{ scene: Scene }> = ({ scene }) => {
  const { subtitle } = scene;

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(82% + 10px)', // スライドエリアの直下
        left: '20px',
        width: 'calc(75% - 40px)',
        zIndex: 5
      }}
    >
      {/* 字幕背景 */}
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '15px 25px',
          borderRadius: '8px',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <p
          style={{
            color: subtitle.color || '#ffffff',
            fontSize: `${subtitle.fontSize || 24}px`,
            textAlign: 'left',
            margin: 0,
            lineHeight: 1.5,
            fontFamily: 'Arial, "Hiragino Sans", "Yu Gothic", sans-serif'
          }}
        >
          {subtitle.text}
        </p>
      </div>
    </div>
  );
};
