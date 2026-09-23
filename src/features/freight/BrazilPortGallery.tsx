const commons = 'https://commons.wikimedia.org/wiki/File:';
const ports = [
  { id: 'santos', name: 'Santos', state: 'São Paulo', image: 'santos.webp', height: 769,
    alt: 'Guindastes e navio de contêineres no Porto de Santos',
    description: 'Inclua o endereço de entrega em São Paulo ou no interior ao comparar a chegada por Santos.',
    author: 'Enio Prado', source: commons + 'Porto_de_Santos_(49871300568).jpg', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/' },
  { id: 'paranagua', name: 'Paranaguá', state: 'Paraná', image: 'paranagua.webp', height: 960,
    alt: 'Navio porta-contêineres e guindastes no Porto de Paranaguá',
    description: 'Compare o desembarque em Paranaguá com a retirada, a armazenagem e o transporte até o destino no Paraná.',
    author: 'CaptainDarwin', source: commons + 'Paranagu%C3%A1_Commercial_Harbor.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { id: 'itajai', name: 'Itajaí', state: 'Santa Catarina', image: 'itajai.webp', height: 853,
    alt: 'Navios de contêineres no complexo portuário de Itajaí',
    description: 'Informe o terminal exato e a cidade de recebimento. Itajaí e Navegantes ficam em margens diferentes do rio.',
    author: 'Marinha do Brasil', source: commons + 'Porto_de_Itaja%C3%AD,_Santa_Catarina_-_2021_(53692834842).jpg', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/' },
  { id: 'suape', name: 'Suape', state: 'Pernambuco', image: 'suape.webp', height: 720,
    alt: 'Vista aérea do terminal de contêineres de Suape, em Pernambuco',
    description: 'Para entregas em Pernambuco e no Nordeste, compare a chegada por Suape com o transporte até o endereço do comprador.',
    author: 'Complexo Industrial Portuário de Suape', source: commons + 'TECON_SUAPE.jpg', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/' },
  { id: 'rio-de-janeiro', name: 'Rio de Janeiro', state: 'Rio de Janeiro', image: 'rio-de-janeiro.webp', height: 819,
    alt: 'Guindastes de contêineres no Porto do Rio de Janeiro',
    description: 'Confirme terminal, responsável pela retirada e endereço de entrega para comparar a opção pelo Rio de Janeiro.',
    author: 'Wilfredor', source: commons + 'Container_cranes_at_the_Port_of_Rio_de_Janeiro,_Brazil_2.jpg', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
];
export default function BrazilPortGallery() {
  return <section id="brazil-ports" aria-labelledby="br-ports">
    <p className="mb-3 text-sm font-bold tracking-widest text-purple-800">PORTOS DE DESTINO</p>
    <h2 id="br-ports" className="text-3xl font-bold">Cinco portos para planejar sua importação</h2>
    <p className="mt-4 max-w-3xl leading-7">Compare o porto de chegada com o endereço do comprador. A escolha depende da carga, do itinerário disponível e do custo da operação até a entrega acordada.</p>
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {ports.map(port => <article key={port.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex aspect-[4/3] items-center bg-slate-950">
          <img src={`/freight-media/brazil-ports/${port.image}`} alt={port.alt} width={1280} height={port.height} loading="lazy" decoding="async" className="h-full w-full object-contain" />
        </div>
        <div className="p-6"><p className="text-sm text-slate-600">{port.state}</p><h3 className="mt-1 text-2xl font-bold">{port.name}</h3><p className="mt-3 leading-7">{port.description}</p></div>
      </article>)}
    </div>
    <details className="mt-5 text-xs leading-6 text-slate-600">
      <summary className="w-fit cursor-pointer underline">Créditos das fotografias</summary>
      <ul className="mt-2 space-y-1">{ports.map(port => <li key={port.id}>{port.name}: <a href={port.source} className="underline">{port.author}</a> · <a href={port.licenseUrl} className="underline">{port.license}</a> · Redimensionamento e conversão para WebP.</li>)}</ul>
    </details>
  </section>;
}
