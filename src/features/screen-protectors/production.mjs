import { EN } from './locales/en.mjs';

export const NEW_FACTORY_CLIPS = [
  {id:'factory-cutting',file:'factory-cutting-12s',poster:'factory-cutting-poster',start:52,duration:12,title:'Glass-sheet preparation',description:'The machine head travels across a large glass sheet before the sheet is separated.',check:'Confirm the glass grade, incoming thickness and cutting method.'},
  {id:'factory-separating',file:'factory-separating-12s',poster:'factory-separating-poster',start:83,duration:12,title:'Sheet separation',description:'An operator separates the prepared sheet and handles the smaller sections.',check:'Ask how blank dimensions and edge damage are checked before machining.'},
  {id:'factory-machining',file:'factory-machining-12s',poster:'factory-machining-poster',start:117,duration:12,title:'Blank machining',description:'Clamped glass blanks pass through a machine operation with moving heads and liquid flow.',check:'Match the outer profile, openings and edge tolerances to the selected phone model.'},
  {id:'factory-printing',file:'factory-printing-12s',poster:'factory-printing-poster',start:480,duration:12,title:'Screen-printing station',description:'Glass moves between stations while a screen and squeegee mechanism work over the surface.',check:'Confirm the printed area, border width, ink and curing method for the quoted SKU.'},
  {id:'factory-rollers',file:'factory-rollers-12s',poster:'factory-rollers-poster',start:600,duration:12,title:'Roll-material processing',description:'Roll material and glass pieces move through the feed and roller section.',check:'Identify each layer: adhesive, release liner or temporary protection. Ask for a layer drawing.'},
  {id:'factory-inspection',file:'factory-inspection-12s',poster:'factory-inspection-poster',start:697,duration:12,title:'Manual review and sorting',description:'Operators handle and look over individual pieces before returning them to trays.',check:'Request the actual inspection criteria, sample size and batch record.'},
  {id:'factory-packing',file:'factory-packing-12s',poster:'factory-packing-poster',start:750,duration:12,title:'Retail packing',description:'Operators assemble retail boxes, insert contents and arrange the finished packs.',check:'Confirm the pack contents, model labels, pieces per carton and final carton dimensions.'},
];
const existing = EN.media.clips.slice(3).map(c => ({...c}));
existing[0].title = 'Fixture loading and machine operation';
existing[0].check = 'Confirm which surfaces are processed and the inspection method for edges and thickness.';
existing[1].title = 'Rack handling at a tank';
existing[1].check = 'Ask what this bath does and which treatment conditions apply. The footage alone does not identify the chemistry.';
existing[2].title = 'Automatic pickup and transfer';
existing[2].check = 'Confirm handling marks, surface protection and the next production step.';
export const FACTORY_CLIPS = [
  ...NEW_FACTORY_CLIPS.slice(0,3), existing[0], existing[1],
  NEW_FACTORY_CLIPS[3], NEW_FACTORY_CLIPS[4], existing[2],
  NEW_FACTORY_CLIPS[5], NEW_FACTORY_CLIPS[6],
];
export const VIDEO_COPY = {
  page:'Process videos', title:'Screen protector\nfactory process videos.',
  intro:'Watch screen protector production footage filmed by the DDNZ team. Choose a stage to see the work and the specifications to confirm before ordering.',
  eyebrow:'DDNZ TEAM / FACTORY FOOTAGE', nav:'Production stages', shown:'In this clip', check:'Ask before ordering',
  scope:'Production stages and packaging vary by product. Confirm the route and specifications for your chosen SKU.',
  library:'Factory process videos', count:'10 production stages · real footage', watch:'Watch the process',
  installation:'Installation and screen observation', installIntro:'Watch manual placement, installer operation and a screen-viewing demonstration. The viewing clip is an observation, not an optical test.',
  play:'Play video', loading:'Loading video…', retry:'Retry video',
};
