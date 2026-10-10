import React from 'react';
import ar from '../locales/gulf/ar.mjs';
import zh from '../locales/planning/zh-gulf.json';
import fr from '../locales/planning/fr-gulf.json';
import es from '../locales/planning/es-gulf.json';
import pt from '../locales/planning/pt-gulf.json';
import ru from '../locales/planning/ru-gulf.json';
import tr from '../locales/planning/tr-gulf.json';
const copy={ar,zh,fr,es,pt,ru,tr};
export default function GulfIceEntry({locale}) {const prefix=locale==='zh'?'/zh-cn':'/'+locale;return <p className="category-market-note"><a href={prefix+'/sourcing/commercial-kitchen-equipment-from-china/#commercial-kitchen-gulf'}>{copy[locale].entry} ↓</a></p>;}
