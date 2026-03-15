import { Composition } from 'remotion';
import { ExplanationVideo } from './ExplanationVideo';
import { sampleConfig } from './config';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ExplanationVideo"
        component={ExplanationVideo}
        durationInFrames={sampleConfig.durationInFrames}
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
