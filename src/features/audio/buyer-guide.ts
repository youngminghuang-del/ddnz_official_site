import en from './buyer-locales/en.json';
import zh from './buyer-locales/zh.json';
import es from './buyer-locales/es.json';
import ar from './buyer-locales/ar.json';
import ru from './buyer-locales/ru.json';
import fr from './buyer-locales/fr.json';
import pt from './buyer-locales/pt.json';
import tr from './buyer-locales/tr.json';
export const buyerCopy={en,zh,es,ar,ru,fr,pt,tr};
// Zero-based product selections. Deliberately omit quantities until MOQ and samples are agreed.
export const bundleSelections=[
 [[0,6],[2,3],[9,10,11],[1,7]],
 [[0,2],[6,7],[2,3,5]],
 [[0,1,3],[2,4,5],[1,2,10],[7,8,9]],
 [[1,2],[1,5],[0,3,4],[6,8,9]],
 [[0,1],[5,6],[1,2,4]],
];
export const extraBundleIndices=[[0,1],[2],[3,4],[5,6],[7]];
export const criterionIndices=[
 [0,0,1,2,0,0,0,1,2,2,2,2],
 [0,0,1,2,0,1,2,0],
 [2,1,0,0,0,1,1,2,2,1,2,2],
 [0,0,0,1,0,0,1,1,2,0],
 [0,1,1,1,1,0,0,2],
];
