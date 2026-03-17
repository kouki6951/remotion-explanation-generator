import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { useAudioDuration } from './useAudioDuration';

interface AudioSegmentProps {
  voiceover: string;
  startFrame: number;
  durationInFrames?: number;
  volume?: number;
  fps: number;
  sceneId: string;
  segmentIndex: number;
}

export const AudioSegment: React.FC<AudioSegmentProps> = ({
  voiceover,
  startFrame,
  durationInFrames,
  volume = 1.0,
  fps,
  sceneId,
  segmentIndex
}) => {
  // 音声の長さを自動取得（durationInFramesが指定されていない場合）
  const autoDuration = useAudioDuration(voiceover, fps);

  const finalDuration = durationInFrames ?? autoDuration;

  // 音声の長さが確定するまでレンダリングしない
  if (finalDuration === null) {
    return null;
  }

  return (
    <Sequence
      key={`audio-${sceneId}-${segmentIndex}`}
      from={startFrame}
      durationInFrames={finalDuration}
    >
      <Audio
        src={staticFile(voiceover)}
        volume={volume}
      />
    </Sequence>
  );
};
