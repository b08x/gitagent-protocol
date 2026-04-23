/**
 * Tests for the Mistral Vibe adapter (export).
 *
 * Uses Node.js built-in test runner (node --test).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { exportToMistralVibe, exportToMistralVibeString } from './mistral-vibe.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeAgentDir(opts: {
  name?: string;
  description?: string;
  soul?: string;
  rules?: string;
  model?: string;
  compliance?: any;
  skills?: Array<{ name: string; description: string; instructions: string; tools?: string[] }>;
}): string {
  const dir = mkdtempSync(join(tmpdir(), 'gitagent-vibe-test-'));

  const modelBlock = opts.model
    ? `model:\n  preferred: ${opts.model}\n`
    : '';

  const complianceBlock = opts.compliance
    ? `compliance:\n  supervision:\n    human_in_the_loop: ${opts.compliance.human_in_the_loop}\n`
    : '';

  writeFileSync(
    join(dir, 'agent.yaml'),
    `spec_version: '0.1.0'\nname: ${opts.name ?? 'test-agent'}\nversion: '0.1.0'\ndescription: '${opts.description ?? 'A test agent'}'\n${modelBlock}${complianceBlock}`,
    'utf-8',
  );

  if (opts.soul !== undefined) {
    writeFileSync(join(dir, 'SOUL.md'), opts.soul, 'utf-8');
  }

  if (opts.rules !== undefined) {
    writeFileSync(join(dir, 'RULES.md'), opts.rules, 'utf-8');
  }

  if (opts.skills) {
    for (const skill of opts.skills) {
      const skillDir = join(dir, 'skills', skill.name);
      mkdirSync(skillDir, { recursive: true });
      const toolsMetadata = skill.tools ? `\nallowed-tools: ${skill.tools.join(' ')}` : '';
      writeFileSync(
        join(skillDir, 'SKILL.md'),
        `---\nname: ${skill.name}\ndescription: '${skill.description}'${toolsMetadata}\n---\n\n${skill.instructions}\n`,
        'utf-8',
      );
    }
  }

  return dir;
}

// ---------------------------------------------------------------------------
// exportToMistralVibe
// ---------------------------------------------------------------------------

describe('exportToMistralVibe', () => {
  test('produces expected folder structure', () => {
    const dir = makeAgentDir({ name: 'Vibe Agent', description: 'Test Vibe' });
    const result = exportToMistralVibe(dir);
    
    assert.ok(result.files['agents/vibe-agent.toml']);
    assert.ok(result.files['prompts/vibe-agent.md']);
  });

  test('main agent TOML contains correct fields', () => {
    const dir = makeAgentDir({ model: 'mistral-large-latest' });
    const result = exportToMistralVibe(dir);
    const toml = result.files['agents/test-agent.toml'] as string;
    
    assert.match(toml, /active_model = "mistral-large-latest"/);
    assert.match(toml, /system_prompt_id = "test-agent"/);
    assert.match(toml, /autocopy_to_clipboard = true/);
  });

  test('system prompt includes SOUL and RULES', () => {
    const dir = makeAgentDir({ soul: 'BE A SOUL', rules: 'FOLLOW RULES' });
    const result = exportToMistralVibe(dir);
    const prompt = result.files['prompts/test-agent.md'] as string;
    
    assert.match(prompt, /BE A SOUL/);
    assert.match(prompt, /FOLLOW RULES/);
  });

  test('tool permissions map correctly from compliance', () => {
    const dir = makeAgentDir({ 
      compliance: { human_in_the_loop: 'none' },
      skills: [{ name: 's1', description: 'd1', instructions: 'i1', tools: ['bash'] }]
    });
    const result = exportToMistralVibe(dir);
    const toml = result.files['agents/test-agent.toml'] as string;
    
    assert.match(toml, /\[tools\.bash\]/);
    assert.match(toml, /permission = "always"/);
  });

  test('skills are exported to correct paths', () => {
    const dir = makeAgentDir({
      skills: [{ name: 'My Skill', description: 'Desc', instructions: 'Inst' }]
    });
    const result = exportToMistralVibe(dir);
    
    assert.ok(result.files['skills/my-skill/SKILL.md']);
    assert.match(result.files['skills/my-skill/SKILL.md'] as string, /name: My Skill/);
  });

  test('exports skill assets (scripts, references, assets)', () => {
    const dir = makeAgentDir({
      skills: [{ name: 'S1', description: 'D1', instructions: 'I1' }]
    });
    const scriptsDir = join(dir, 'skills', 'S1', 'scripts');
    mkdirSync(scriptsDir, { recursive: true });
    writeFileSync(join(scriptsDir, 'run.sh'), '#!/bin/bash\necho hello', 'utf-8');
    
    const result = exportToMistralVibe(dir);
    assert.ok(result.files['skills/s1/scripts/run.sh']);
    const content = result.files['skills/s1/scripts/run.sh'];
    assert.match(content.toString(), /echo hello/);
  });
});

// ---------------------------------------------------------------------------
// exportToMistralVibeString
// ---------------------------------------------------------------------------

describe('exportToMistralVibeString', () => {
  test('contains file markers', () => {
    const dir = makeAgentDir({ name: 'string-test' });
    const result = exportToMistralVibeString(dir);
    
    assert.match(result, /# === agents\/string-test\.toml ===/);
    assert.match(result, /# === prompts\/string-test\.md ===/);
  });

  test('omits binary files from string export', () => {
    const dir = makeAgentDir({
      skills: [{ name: 'S1', description: 'D1', instructions: 'I1' }]
    });
    const assetsDir = join(dir, 'skills', 'S1', 'assets');
    mkdirSync(assetsDir, { recursive: true });
    // Write a binary file (contains null byte)
    writeFileSync(join(assetsDir, 'data.bin'), Buffer.from([0, 1, 2, 3]));
    
    const resultString = exportToMistralVibeString(dir);
    assert.match(resultString, /\[Binary file omitted from text export: 4 bytes\]/);
  });
});
