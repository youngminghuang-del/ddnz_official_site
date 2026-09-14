import React from 'react';

// Isolate Latin model codes and numeric runs inside Arabic text, including signs and units.
export function IsolatedText({ children }) {
  const atom = '(?:[A-Za-z][A-Za-z0-9./°−–-]*|[−-]?[0-9٠-٩]+(?:[.,٬٫][0-9٠-٩]+)*)(?:[ \\t]*(?:°C|°F|mm|kg|kW|W|L|V|h)\\b)?';
  const tokens = new RegExp(`(${atom}(?:[ \\t]*[×+/][ \\t]*${atom})*)`, 'g');
  return <>{String(children ?? '').split(tokens).map((part, index) => index % 2 ? <bdi dir="ltr" key={index}>{part}</bdi> : part)}</>;
}
