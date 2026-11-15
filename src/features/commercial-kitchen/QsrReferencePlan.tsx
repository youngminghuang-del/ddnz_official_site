import { useId, useState } from 'react';

const shell = { left: 80, top: 92, width: 8000, depth: 6000, scale: 0.075 };
const toX = (mm: number) => shell.left + mm * shell.scale;
const toY = (mm: number) => shell.top + mm * shell.scale;

const areas = [
  { name: 'Recepción y frío', x: 150, y: 180, w: 2400, h: 1540, labelX: 1050, labelY: 370 },
  { name: 'Preparación', x: 150, y: 1810, w: 2400, h: 2280, labelX: 1030, labelY: 2030 },
  { name: 'Cocción', x: 2720, y: 180, w: 5130, h: 1800, labelX: 6550, labelY: 650 },
  { name: 'Lavado', x: 5510, y: 3280, w: 2340, h: 1300, labelX: 6570, labelY: 3500 },
  { name: 'Expedición', secondLine: 'y recogida', x: 3180, y: 4730, w: 4670, h: 1120, labelX: 4140, labelY: 5110 },
];

const positions = {
  E01: { x: 3230, y: 470, kind: 'fryer' },
  E02: { x: 4260, y: 470, kind: 'griddle' },
  E03: { x: 420, y: 2190, kind: 'prep' },
  E04: { x: 420, y: 530, kind: 'chiller' },
  E05: { x: 3020, y: 270, kind: 'hood' },
  E06: { x: 5740, y: 3690, kind: 'sink' },
  E07: { x: 6970, y: 5010, kind: 'ice' },
} as const;

const routes = [
  { id: 'food', label: 'Alimentos', color: '#246353', dash: undefined, points: [[1830,130],[1830,1480],[2240,1480],[2240,2850],[3140,2850],[3140,1500],[3890,1500],[3890,4410],[5070,4410],[5070,5800]] },
  { id: 'staff', label: 'Personal', color: '#354e81', dash: '8 5', points: [[2810,5790],[2810,3280],[4640,3280],[4640,1550]] },
  { id: 'ware', label: 'Retorno de vajilla', color: '#a5452e', dash: '2 5', points: [[6170,5780],[6170,4770],[6430,4770],[6430,4470]] },
] as const;

type Equipment = [string, string, string, string];
type Props = { equipment: Equipment[]; names: string[]; concept: string };

function Footprint({ code, name, dimensions }: { code: keyof typeof positions; name: string; dimensions: string }) {
  const {x, y, kind} = positions[code];
  const [width, depth] = dimensions.split(' x ').map(Number);
  const w = width * shell.scale, h = depth * shell.scale;
  const isHood = kind === 'hood';
  return <g transform={`translate(${toX(x)},${toY(y)})`}>
    <title>{`${code} · ${name} · ${width} × ${depth} mm`}</title>
    <rect width={w} height={h} rx="2" fill={isHood ? 'none' : '#fffdfb'} stroke="#354962"
      strokeWidth={isHood ? 1.5 : 1.1} strokeDasharray={isHood ? '7 4' : undefined}/>
    <g fill="none" stroke="#8291a3" strokeWidth="1.1">
      {kind === 'fryer' && [0.12, 0.54].map(f => <rect key={f} x={w*f} y={h*.16} width={w*.33} height={h*.6} rx="3"/>)}
      {kind === 'griddle' && <rect x="5" y="6" width={w-10} height={h-15} rx="2"/>}
      {kind === 'prep' && [0.12,0.31,0.5,0.69].map(f => <rect key={f} x={w*f} y="5" width={w*.16} height="14" rx="2"/>)}
      {kind === 'chiller' && <path d={`M8 7H${w-8}V${h-7}H8ZM${w-15} ${h/2-10}v20`}/>}
      {kind === 'sink' && [0.10,0.4].map(f => <rect key={f} x={w*f} y="9" width={w*.24} height={h-18} rx="4"/>)}
      {kind === 'ice' && <rect x="5" y="7" width={w-10} height={h-14} rx="2"/>}
    </g>
    <g transform={`translate(${isHood ? w-34 : w/2-17},${isHood ? -14 : h/2-9})`}>
      <rect width="34" height="18" rx="2" fill={isHood ? '#fffdfb' : '#10243f'}/>
      <text x="17" y="12.7" fill={isHood ? '#10243f' : '#fff'} fontSize="10" fontWeight="700" textAnchor="middle">{code}</text>
    </g>
  </g>;
}

export default function QsrReferencePlan({ equipment, names, concept }: Props) {
  const id = useId();
  const [focus, setFocus] = useState<string | null>(null);
  const x2 = toX(shell.width), y2 = toY(shell.depth);
  const item = (code: keyof typeof positions) => {
    const index = equipment.findIndex(([key]) => key === code);
    return <Footprint key={code} code={code} name={names[index]} dimensions={equipment[index][2]}/>;
  };
  return <figure className="qsr-plan m-0 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900">
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6">
      <div><p className="text-xs font-bold uppercase tracking-wider text-purple-800">Planta de equipamiento</p>
        <p className="mt-1 font-bold">Cocina para llevar y servicio rápido</p></div>
      <span className="text-sm font-semibold text-slate-600">Anteproyecto · 48 m²</span>
    </header>
    <p className="border-b border-slate-200 px-4 py-2 text-xs text-slate-600 sm:hidden">Desliza horizontalmente para ver todo el plano.</p>
    <div className="overflow-x-auto bg-slate-50" tabIndex={0} aria-label="Plano desplazable horizontalmente">
      <svg viewBox="0 0 760 622" width="760" height="622" role="img" aria-labelledby={id+'-title '+id+'-desc'}
        className="mx-auto block h-auto w-full min-w-[650px] max-w-[900px] font-sans">
        <title id={id+'-title'}>Planta conceptual de una cocina para llevar</title>
        <desc id={id+'-desc'}>Planta de ocho por seis metros con cinco zonas, siete equipos numerados y recorridos separados para alimentos, personal y vajilla.</desc>
        <defs>
          <pattern id={id+'-grid'} x={shell.left} y={shell.top} width="37.5" height="37.5" patternUnits="userSpaceOnUse">
            <path d="M 37.5 0 L 0 0 0 37.5" fill="none" stroke="#dce3ea" strokeWidth=".7"/>
          </pattern>
          {routes.map(route => <marker key={route.id} id={id+'-arrow-'+route.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 0 10 Z" fill={route.color}/>
          </marker>)}
        </defs>
        <rect width="760" height="622" fill="#fffdfb"/>
        <rect x={shell.left} y={shell.top} width={x2-shell.left} height={y2-shell.top} fill={'url(#'+id+'-grid)'}/>
        {areas.map(area => <rect key={area.name} x={toX(area.x)} y={toY(area.y)} width={area.w*shell.scale} height={area.h*shell.scale}
          fill={area.name === 'Cocción' ? '#f0e9f6' : '#e9eff4'} fillOpacity=".6" stroke="#bac5d2" strokeDasharray="3 4"/>)}
        <g stroke="#6b7b90" strokeWidth="1" fill="none">
          <path d={`M${shell.left} 79V48 M${x2} 79V48 M${shell.left} 59H${x2} M75 64l10-10 M675 64l10-10`}/>
          <path d={`M70 ${shell.top}H39 M70 ${y2}H39 M50 ${shell.top}V${y2} M45 97l10-10 M45 547l10-10`}/>
        </g>
        <g fill="#10243f" fontSize="14" fontWeight="650">
          <text x="380" y="51" textAnchor="middle">8.000 mm</text>
          <text transform="translate(41 317) rotate(-90)" textAnchor="middle">6.000 mm</text>
        </g>
        <path d={`M${toX(1550)} ${shell.top}H${shell.left}V${y2}H${toX(4610)} M${toX(6700)} ${y2}H${x2}V${shell.top}H${toX(2150)}`}
          fill="none" stroke="#10243f" strokeWidth="4"/>
        <g fill="#52647c" fontSize="10" fontWeight="700" letterSpacing=".45">
          <text x={toX(1850)} y="82" textAnchor="middle">ENTRADA DE SUMINISTROS</text>
          <text x={toX(5670)} y="565" textAnchor="middle">RECOGIDA / RETORNO</text>
        </g>
        {routes.map(route => {
          const points = route.points.map(([x,y]) => toX(x)+','+toY(y)).join(' ');
          return <g key={route.id} opacity={focus && focus !== route.id ? .16 : 1}>
            <polyline points={points} fill="none" stroke="#fffdfb" strokeWidth="7" strokeLinejoin="round"/>
            <polyline points={points} fill="none" stroke={route.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
              strokeDasharray={route.dash} markerEnd={'url(#'+id+'-arrow-'+route.id+')'}/>
          </g>;
        })}
        {(['E01','E02','E03','E04','E06','E07','E05'] as const).map(item)}
        <g transform={`translate(${toX(420)},${toY(3320)})`}>
          <rect width="112.5" height="52.5" rx="2" fill="#fffdfb" stroke="#354962"/>
          <text x="56" y="30" textAnchor="middle" fontSize="10.5" fill="#10243f">Mesa de trabajo</text>
        </g>
        {areas.map(area => <text key={area.name} x={toX(area.labelX)} y={toY(area.labelY)}
          fill="#10243f" fontSize="12" fontWeight="650" textAnchor="middle">{area.name}
          {area.secondLine && <tspan x={toX(area.labelX)} dy="15">{area.secondLine}</tspan>}
        </text>)}
        <g transform="translate(80 585)" fill="#10243f" fontSize="10">
          <rect width="75" height="5"/><rect x="75" width="75" height="5" fill="#fffdfb" stroke="#10243f"/>
          <text x="0" y="17">0</text><text x="75" y="17" textAnchor="middle">1</text><text x="150" y="17" textAnchor="end">2 m</text>
        </g>
        <text x="680" y="590" textAnchor="end" fill="#52647c" fontSize="11">Cotas en mm · Posiciones de referencia</text>
      </svg>
    </div>
    <figcaption className="border-t border-slate-200 px-4 py-4 sm:px-6">
      <div className="flex flex-wrap gap-2" aria-label="Recorridos del plano">
        {routes.map(route => <button key={route.id} type="button" aria-pressed={focus === route.id}
          onClick={() => setFocus(current => current === route.id ? null : route.id)}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold aria-pressed:border-slate-600 aria-pressed:bg-slate-100">
          <svg aria-hidden="true" width="26" height="9" viewBox="0 0 26 9"><path d="M1 4.5H25" stroke={route.color} strokeWidth="2.5" strokeDasharray={route.dash}/></svg>
          {route.label}
        </button>)}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{concept} Confirma las medidas del local, accesos y conexiones antes de definir la instalación.</p>
    </figcaption>
  </figure>;
}
