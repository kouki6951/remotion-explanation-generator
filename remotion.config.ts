import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// publicフォルダを静的ファイルのルートとして設定
Config.setPublicDir('./public');
