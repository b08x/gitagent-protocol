import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';
import { loadAgentManifest, loadFileIfExists } from '../utils/loader.js';
import { loadAllSkills, getAllowedTools } from '../utils/skill-loader.js';
import { buildComplianceSection } from './shared.js';

/**
 * Export a gitagent to Mistral Vibe folder structure.
 * 
 * agents/
 *   <agent-name>.toml
 * prompts/
 *   <agent-name>.md
 * skills/
 *   <skill-name>/
 *     SKILL.md
 */
export interface MistralVibeExport {
  files: Record<string, string | Buffer>;
}

export function exportToMistralVibe(dir: string): MistralVibeExport {
  const agentDir = resolve(dir);
  const manifest = loadAgentManifest(agentDir);
  const files: Record<string, string | Buffer> = {};

  const agentName = manifest.name.toLowerCase().replace(/\s+/g, '-');
  
  // 1. Main Agent TOML
  const mainConfig = buildConfig(agentDir, manifest, agentName);
  files[`agents/${agentName}.toml`] = stringifyToToml(mainConfig);

  // 2. Main System Prompt
  const systemPrompt = buildInstructions(agentDir, manifest);
  files[`prompts/${agentName}.md`] = systemPrompt;

  // 3. Sub-agents
  if (manifest.agents) {
    for (const [subName, subConfig] of Object.entries(manifest.agents)) {
      const slug = subName.toLowerCase().replace(/\s+/g, '-');
      const subDir = join(agentDir, 'agents', subName);
      
      const subToml: Record<string, any> = {
        active_model: manifest.model?.preferred || 'mistral-large-latest',
        system_prompt_id: slug,
        disabled_tools: []
      };
      
      files[`agents/${slug}.toml`] = stringifyToToml(subToml);
      
      // Sub-agent instructions (SOUL.md if it exists)
      let instructions = subConfig.description || '';
      const soul = loadFileIfExists(join(subDir, 'SOUL.md'));
      if (soul) instructions += '\n\n' + soul;
      files[`prompts/${slug}.md`] = instructions;
    }
  }

  // 4. Skills
  const skillsDir = join(agentDir, 'skills');
  if (existsSync(skillsDir)) {
    const skills = loadAllSkills(skillsDir);
    for (const skill of skills) {
      const skillName = skill.frontmatter.name.toLowerCase().replace(/\s+/g, '-');
      // Reconstruct SKILL.md with frontmatter
      const raw = `---\n${yaml.dump(skill.frontmatter)}---\n\n${skill.instructions}`;
      files[`skills/${skillName}/SKILL.md`] = raw;
      
      // Collect additional assets (scripts, references, assets)
      const assetDirs = ['scripts', 'references', 'assets'];
      for (const sub of assetDirs) {
        const fullSubDir = join(skill.directory, sub);
        if (existsSync(fullSubDir)) {
          collectFilesRecursive(fullSubDir, join('skills', skillName, sub), files);
        }
      }
    }
  }

  return { files };
}

/**
 * Recursively collect files from a directory and add them to the files map.
 */
function collectFilesRecursive(
  dir: string,
  prefix: string,
  files: Record<string, string | Buffer>
): void {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relPath = join(prefix, entry.name);
    if (entry.isDirectory()) {
      collectFilesRecursive(fullPath, relPath, files);
    } else if (entry.isFile()) {
      try {
        // Read as Buffer to support binary files
        files[relPath] = readFileSync(fullPath);
      } catch (e) {
        // Skip files that cannot be read
      }
    }
  }
}

export function exportToMistralVibeString(dir: string): string {
  const exp = exportToMistralVibe(dir);
  const parts: string[] = [];

  for (const [path, content] of Object.entries(exp.files)) {
    parts.push(`# === ${path} ===`);
    if (Buffer.isBuffer(content)) {
      if (isBinary(content)) {
        parts.push(`[Binary file omitted from text export: ${content.length} bytes]`);
      } else {
        parts.push(content.toString('utf-8'));
      }
    } else {
      parts.push(content);
    }
    parts.push('');
  }

  return parts.join('\n').trimEnd() + '\n';
}

/**
 * Heuristic to check if a buffer contains binary data.
 */
function isBinary(buffer: Buffer): boolean {
  // Check for null bytes in the first 512 bytes
  for (let i = 0; i < Math.min(buffer.length, 512); i++) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

function buildInstructions(
  agentDir: string,
  manifest: ReturnType<typeof loadAgentManifest>,
): string {
  const parts: string[] = [];

  // Agent identity
  parts.push(`# ${manifest.name}`);
  parts.push(`${manifest.description}`);
  parts.push('');

  // SOUL.md
  const soul = loadFileIfExists(join(agentDir, 'SOUL.md'));
  if (soul) parts.push(soul + '\n');

  // RULES.md
  const rules = loadFileIfExists(join(agentDir, 'RULES.md'));
  if (rules) parts.push(rules + '\n');

  // DUTIES.md
  const duty = loadFileIfExists(join(agentDir, 'DUTIES.md'));
  if (duty) parts.push(duty + '\n');

  // Compliance
  if (manifest.compliance) {
    const constraints = buildComplianceSection(manifest.compliance);
    if (constraints) parts.push(constraints + '\n');
  }

  return parts.join('\n').trimEnd() + '\n';
}

function buildConfig(
  agentDir: string,
  manifest: ReturnType<typeof loadAgentManifest>,
  promptId: string
): Record<string, any> {
  const config: Record<string, any> = {
    active_model: manifest.model?.preferred || 'mistral-large-latest',
    system_prompt_id: promptId,
    autocopy_to_clipboard: true,
    enable_telemetry: false,
  };

  // Tools mapping
  const allowedTools = collectAllowedTools(agentDir);
  if (allowedTools.length > 0) {
    config.tools = {};
    for (const tool of allowedTools) {
      if (['bash', 'read_file', 'write_file', 'grep', 'ls'].includes(tool)) {
        config.tools[tool] = {
          permission: manifest.compliance?.supervision?.human_in_the_loop === 'none' ? 'always' : 'ask'
        };
      }
    }
  }

  return config;
}

function collectAllowedTools(agentDir: string): string[] {
  const tools: Set<string> = new Set();
  const skillsDir = join(agentDir, 'skills');
  if (existsSync(skillsDir)) {
    const skills = loadAllSkills(skillsDir);
    for (const skill of skills) {
      for (const tool of getAllowedTools(skill.frontmatter)) {
        tools.add(tool);
      }
    }
  }
  return Array.from(tools);
}

function stringifyToToml(obj: any, currentPrefix = ''): string {
  let toml = '';
  const scalars: [string, any][] = [];
  const objects: [string, any][] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      objects.push([key, value]);
    } else {
      scalars.push([key, value]);
    }
  }

  for (const [key, value] of scalars) {
    toml += `${key} = ${JSON.stringify(value)}\n`;
  }

  for (const [key, value] of objects) {
    const sectionName = currentPrefix ? `${currentPrefix}.${key}` : key;
    toml += `\n[${sectionName}]\n${stringifyToToml(value, sectionName)}`;
  }

  return toml;
}
