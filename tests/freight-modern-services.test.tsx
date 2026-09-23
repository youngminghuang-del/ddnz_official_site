import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import ModernFreightServiceContent, {
  modernFreightServiceMetadata,
  modernizedFreightServicePaths,
} from '../src/features/freight/ModernFreightServiceContent.tsx';
import type { Language } from '../src/i18n/translations.ts';

const languages: Language[] = ['en', 'zh', 'ru', 'fr', 'es', 'ar', 'pt', 'tr'];

test('modern freight services render complete authored pages in eight languages', () => {
  for (const path of modernizedFreightServicePaths) {
    for (const language of languages) {
      const html = renderToStaticMarkup(<ModernFreightServiceContent path={path} language={language} />);
      assert.equal((html.match(/<main\b/g) || []).length, 1, `${path} ${language}: one main landmark`);
      assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path} ${language}: one h1`);
      assert.equal((html.match(/<img\b/g) || []).length, 4, `${path} ${language}: hero plus three evidence images`);
      assert.match(html, /id="service-plan"/);
      assert.match(html, /id="service-evidence"/);
      assert.match(html, /id="quote-controls"/);
      assert.match(html, /id="operating-handover"/);
      assert.doesNotMatch(html, /<img[^>]+src="https?:\/\//, `${path} ${language}: local media only`);
      assert.equal(html.includes('dir="rtl"'), language === 'ar', `${path} ${language}: direction`);
      assert.ok(modernFreightServiceMetadata(path, language).title.includes('DDNZ Global'));

      for (const [, src] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
        assert.ok(existsSync(join(process.cwd(), 'public', src)), `${path} ${language}: missing ${src}`);
      }
    }
  }
});
