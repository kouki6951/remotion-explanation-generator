import { VideoConfig } from './config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * JSONファイルからVideoConfigを読み込む関数
 * @param configPath - 設定ファイルのパス
 * @returns VideoConfig
 */
export function loadConfigFromJson(configPath: string): VideoConfig {
  try {
    const absolutePath = path.resolve(configPath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const config: VideoConfig = JSON.parse(fileContent);

    // 基本的なバリデーション
    if (!config.scenes || !config.characters) {
      throw new Error('Invalid config: scenes and characters are required');
    }

    return config;
  } catch (error) {
    console.error('Failed to load config:', error);
    throw error;
  }
}

/**
 * TypeScriptファイルから直接Configをインポートする場合の型チェック
 * @param config - VideoConfig
 * @returns boolean
 */
export function validateConfig(config: VideoConfig): boolean {
  // 必須フィールドのチェック
  if (!config.title || !config.fps || !config.durationInFrames) {
    return false;
  }

  // シーンのバリデーション
  for (const scene of config.scenes) {
    if (!scene.id || scene.startFrame === undefined) {
      return false;
    }

    // キャラクターIDの存在チェック
    if (!config.characters[scene.character.id]) {
      console.error(`Character "${scene.character.id}" not found in config`);
      return false;
    }
  }

  return true;
}
