import { Composition } from 'remotion';
import { ExplanationVideo } from './ExplanationVideo';
import { sampleConfig } from './config';
import { useAllAudioDurations } from './useAllAudioDurations';
import { calculateTotalDuration } from './calculateTotalDuration';

export const RemotionRoot: React.FC = () => {
  const audioDurations = useAllAudioDurations(sampleConfig);
  const totalDuration = sampleConfig.durationInFrames ?? calculateTotalDuration(sampleConfig, audioDurations);

  return (
    <>
      <Composition
        id="ExplanationVideo"
        component={ExplanationVideo}
        durationInFrames={totalDuration}
        fps={sampleConfig.fps}
        width={sampleConfig.width}
        height={sampleConfig.height}
        defaultProps={{
          config: sampleConfig
        }}
      />
    </>
  );
};
