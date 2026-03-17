import React from 'react';
import { AbsoluteFill, useCurrentFrame, staticFile, Audio, OffthreadVideo, useVideoConfig } from 'remotion';
import { VideoConfig, Scene } from './config';
import { useBlinkAnimation } from './useBlinkAnimation';
import { useMouthAnimation } from './useMouthAnimation';
import { PdfSlide } from './PdfSlide';
import { AudioSegment } from './AudioSegment';
import { useSceneAudioInfo } from './useSceneAudioInfo';
import { useAllAudioDurations } from './useAllAudioDurations';
import { calculateSceneDuration } from './calculateSceneDuration';
import { normalizeScenes } from './normalizeScenes';

interface ExplanationVideoProps {
  config: VideoConfig;
}

export const ExplanationVideo: React.FC<ExplanationVideoProps> = ({ config }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // すべての音声ファイルの長さを一度に取得
  const audioDurations = useAllAudioDurations(config);

  // シーンを正規化（startFrameとdurationInFramesを自動計算）
  const normalizedScenes = React.useMemo(
    () => normalizeScenes(config.scenes, audioDurations),
    [config.scenes, audioDurations]
  );

  // 現在のフレームに対応するシーンを取得
  const currentScene = normalizedScenes.find(
    (scene) => frame >= scene.startFrame && frame < scene.startFrame + scene.durationInFrames
  );

  // BGMのフェードアウト計算（最後の2秒間）
  const fadeOutDuration = 60; // 2秒 = 60フレーム
  const fadeOutStartFrame = durationInFrames - fadeOutDuration;
  const bgmVolume = React.useMemo(() => {
    if (frame < fadeOutStartFrame) {
      return config.backgroundMusic?.volume ?? 0.5;
    }
    const fadeProgress = (durationInFrames - frame) / fadeOutDuration;
    return (config.backgroundMusic?.volume ?? 0.5) * fadeProgress;
  }, [frame, fadeOutStartFrame, durationInFrames, config.backgroundMusic?.volume]);

  if (!currentScene) {
    return <AbsoluteFill style={{ backgroundColor: '#000' }} />;
  }

  return (
    <AbsoluteFill>
      {/* BGM */}
      {config.backgroundMusic && (
        <Audio
          src={staticFile(config.backgroundMusic.path)}
          volume={bgmVolume}
          loop
        />
      )}

      {/* シーン毎の音声（セグメント対応、順次再生） */}
      {normalizedScenes.map((scene) => {
        if (!scene.segments || scene.segments.length === 0) return null;

        // シーン内の音声情報を取得
        const sceneAudioInfo = useSceneAudioInfo(scene, audioDurations);

        // 各セグメントの音声を順次再生
        let audioInfoIndex = 0;

        return scene.segments.map((segment, index) => {
          if (!segment.audio) return null;

          const info = sceneAudioInfo[audioInfoIndex];
          audioInfoIndex++;

          if (!info) return null; // 音声情報がまだ読み込まれていない

          const audioStartFrame = scene.startFrame + info.startFrame;

          return (
            <AudioSegment
              key={`audio-${scene.id}-${index}`}
              voiceover={segment.audio.voiceover}
              startFrame={audioStartFrame}
              durationInFrames={info.duration}
              volume={segment.audio.volume}
              fps={config.fps}
              sceneId={scene.id}
              segmentIndex={index}
            />
          );
        });
      })}

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
          <SubtitleArea scene={currentScene} config={config} audioDurations={audioDurations} />
        </div>
      </AbsoluteFill>

      {/* キャラクターエリア（最前面） */}
      <AbsoluteFill>
        <CharacterArea scene={currentScene} config={config} audioDurations={audioDurations} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// スライドエリアコンポーネント
const SlideArea: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { slide } = scene;

  // シーン内での相対フレーム位置
  const relativeFrame = frame - (scene.startFrame ?? 0);

  // アニメーション設定（最初の30フレーム = 1秒）
  const animationDuration = 30;
  const progress = Math.min(relativeFrame / animationDuration, 1);

  // イージング関数（easeOutCubic）
  const easeProgress = 1 - Math.pow(1 - progress, 3);

  // アニメーションスタイル
  const opacity = easeProgress;
  const translateX = (1 - easeProgress) * -50; // 左から50pxスライドイン

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
        padding: '40px',
        opacity: opacity,
        transform: `translateX(${translateX}px)`
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
              fontSize: slide.fontSize ? `${slide.fontSize}px` : '80px',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 0,
              fontFamily: 'Arial, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              whiteSpace: 'pre-line'
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
        {slide.type === 'video' && slide.videoPath && relativeFrame >= 0 && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <video
              src={staticFile(slide.videoPath)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              muted
              playsInline
              ref={(video) => {
                if (video) {
                  // 再生速度を固定
                  video.playbackRate = 1.0;

                  const targetTime = relativeFrame / fps;
                  // 動画の長さを取得してループ処理
                  const duration = video.duration;
                  if (duration && !isNaN(duration)) {
                    const loopedTime = targetTime % duration;
                    if (Math.abs(video.currentTime - loopedTime) > 0.1) {
                      video.currentTime = loopedTime;
                    }
                  } else if (Math.abs(video.currentTime - targetTime) > 0.1) {
                    video.currentTime = targetTime;
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// キャラクターエリアコンポーネント
const CharacterArea: React.FC<{
  scene: Scene;
  config: VideoConfig;
  audioDurations: Map<string, number>;
}> = ({
  scene,
  config,
  audioDurations
}) => {
  const frame = useCurrentFrame();
  const character = config.characters[scene.character.id];
  const blinkState = useBlinkAnimation(config.fps);

  // シーン内の各セグメントの実際の音声情報を取得
  const audioInfo = useSceneAudioInfo(scene, audioDurations);

  // 現在のシーンで音声が再生されているかチェック（実際の音声ファイルの長さに基づく）
  const isAudioPlaying = React.useMemo(() => {
    // シーン内の相対フレーム位置を計算
    const relativeFrame = frame - scene.startFrame;

    // シーンの範囲外は常にfalse（動的に長さを計算）
    const sceneDuration = calculateSceneDuration(scene, audioDurations);
    if (relativeFrame < 0 || relativeFrame >= sceneDuration) {
      return false;
    }

    // 各セグメントの音声再生範囲をチェック
    for (const info of audioInfo) {
      if (relativeFrame >= info.startFrame && relativeFrame < info.endFrame) {
        // デバッグ出力
        if (scene.id === 'scene1' && relativeFrame % 30 === 0) {
          console.log(`[Scene1 Debug] Frame: ${frame}, RelativeFrame: ${relativeFrame}, AudioStart: ${info.startFrame}, AudioEnd: ${info.endFrame}, Duration: ${info.duration}, IsPlaying: true`);
        }
        return true;
      }
    }

    // デバッグ出力
    if (scene.id === 'scene1' && relativeFrame % 30 === 0) {
      console.log(`[Scene1 Debug] Frame: ${frame}, RelativeFrame: ${relativeFrame}, AudioInfo: ${JSON.stringify(audioInfo)}, IsPlaying: false`);
    }

    return false;
  }, [frame, scene, audioInfo]);

  const mouthState = useMouthAnimation(isAudioPlaying, config.fps);

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
const SubtitleArea: React.FC<{
  scene: Scene;
  config: VideoConfig;
  audioDurations: Map<string, number>;
}> = ({ scene, config, audioDurations }) => {
  const frame = useCurrentFrame();

  // セグメントがない場合は何も表示しない
  if (!scene.segments || scene.segments.length === 0) {
    return null;
  }

  // シーン内の各セグメントの実際の音声情報を取得
  const audioInfo = useSceneAudioInfo(scene, audioDurations);

  // 現在のフレームに対応するセグメントを取得
  const relativeFrame = frame - scene.startFrame;
  let currentSegment = null;

  // 実際の音声再生タイミングに基づいて字幕を表示
  for (let i = 0; i < audioInfo.length; i++) {
    const info = audioInfo[i];
    if (relativeFrame >= info.startFrame && relativeFrame < info.endFrame) {
      // この音声に対応するセグメントを取得
      let segmentIndex = 0;
      for (const segment of scene.segments) {
        if (segment.audio) {
          if (segmentIndex === i) {
            currentSegment = segment;
            break;
          }
          segmentIndex++;
        }
      }
      break;
    }
  }

  // 表示する字幕がない場合
  if (!currentSegment || !currentSegment.subtitle) {
    return null;
  }

  const subtitle = currentSegment.subtitle;

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
