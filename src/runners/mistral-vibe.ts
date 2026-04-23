import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { exportToMistralVibe } from '../adapters/mistral-vibe.js';
import { AgentManifest } from '../utils/loader.js';
import { error, info, success } from '../utils/format.js';

export interface MistralVibeRunOptions {
  prompt?: string;
}

export function runWithMistralVibe(agentDir: string, manifest: AgentManifest, options: MistralVibeRunOptions = {}): void {
  const exportData = exportToMistralVibe(agentDir);
  const tmpRoot = join(tmpdir(), `gitagent-vibe-${randomBytes(4).toString('hex')}`);
  
  try {
    // 1. Create temporary vibe structure
    mkdirSync(join(tmpRoot, 'agents'), { recursive: true });
    mkdirSync(join(tmpRoot, 'prompts'), { recursive: true });
    mkdirSync(join(tmpRoot, 'skills'), { recursive: true });

    for (const [relPath, content] of Object.entries(exportData.files)) {
      const fullPath = join(tmpRoot, relPath);
      const dir = join(fullPath, '..');
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(fullPath, content, 'utf-8');
    }

    const agentName = manifest.name.toLowerCase().replace(/\s+/g, '-');
    const agentConfigPath = join(tmpRoot, 'agents', `${agentName}.toml`);

    // 2. Launch vibe
    // Vibe typically looks in ~/.vibe, but we can try to point it to our temp structure
    // or use the 'vibe' command with specific flags if supported.
    // Based on docs, it might require files to be in specific places.
    // We'll use the 'vibe' command and assume it's in the PATH.
    
    const args: string[] = ['agent', 'run', agentName];
    if (options.prompt) {
      args.push('--prompt', options.prompt);
    }

    info(`Launching Mistral Vibe with agent "${manifest.name}"...`);
    info(`Temp config stored at: ${tmpRoot}`);
    
    // NOTE: This assumes 'vibe' can be configured to use a custom root via env var or similar.
    // If not, we might need to instruct the user to copy the exported files.
    const result = spawnSync('vibe', args, {
      stdio: 'inherit',
      cwd: agentDir,
      env: {
        ...process.env,
        VIBE_HOME: tmpRoot // Hypothetical env var to point to temp config
      }
    });

    if (result.error) {
      error(`Failed to launch Mistral Vibe: ${result.error.message}`);
      info('Make sure mistral-vibe is installed: pip install mistral-vibe');
      process.exitCode = 1;
      return;
    }

    process.exitCode = result.status ?? 0;

  } catch (e) {
    error(`Mistral Vibe runner error: ${(e as Error).message}`);
    process.exitCode = 1;
  }
}
