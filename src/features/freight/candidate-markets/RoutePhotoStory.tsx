import { FreightPhotoStory, type FreightPhoto } from '../FreightPhotoStory';
import type { CandidateLocale, StandardCandidateCountry } from './model';
import copy from '../routePhotoCopy.json';

const markets = {
  'united-kingdom': [
    {
      file: 'uk-groupage-loading', width: 760, height: 980, focus: 'center 68%',
    },
    {
      file: 'southampton-terminal', width: 640, height: 418,
      credit: {
        name: 'Chris Allen / Geograph Britain and Ireland',
        source: 'https://commons.wikimedia.org/wiki/File:Southampton_container_terminal_-_geograph.org.uk_-_7569878.jpg',
        license: 'CC BY-SA 2.0', licensePath: 'by-sa/2.0',
      },
    },
    {
      file: 'uk-receiving-liftgate', width: 760, height: 456,
    },
  ],
  philippines: [
    {
      file: 'ph-container-loading', width: 760, height: 428,
    },
    {
      file: 'manila-container-terminal', width: 760, height: 570,
      credit: {
        name: 'Patrickroque01',
        source: 'https://commons.wikimedia.org/wiki/File:Manila_International_Container_Terminal_cranes_(Tondo,_Manila;_01-08-2024).jpg',
        license: 'CC BY-SA 4.0', licensePath: 'by-sa/4.0',
      },
    },
    {
      file: 'ph-receiving-check', width: 760, height: 950, focus: 'center 54%',
    },
  ],
} satisfies Record<string, readonly FreightPhoto[]>;

export function RoutePhotoStory({ country, locale }: { country: StandardCandidateCountry; locale: CandidateLocale }) {
  if (country !== 'united-kingdom' && country !== 'philippines') return null;
  return <FreightPhotoStory entries={markets[country]} copy={copy[locale]}/>;
}
