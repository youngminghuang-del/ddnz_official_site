export type FreightPhoto = {
  file: string;
  width: number;
  height: number;
  focus?: string;
  credit?: { name: string; source: string; license: string; licensePath: string };
};

type PhotoCopy = {
  credit: string;
  adjustment: string;
  photos: Record<string, { alt: string; caption: string; detail: string }>;
};

const directory = '/images/freight/route-photo-stories';

export function FreightPhotoStory({ entries, copy }: { entries: readonly FreightPhoto[]; copy: PhotoCopy }) {
  const paired = entries.length === 2;
  const sizes = paired
    ? '(max-width: 640px) calc(100vw - 40px), (max-width: 1200px) 46vw, 580px'
    : '(max-width: 640px) calc(100vw - 40px), (max-width: 1200px) 30vw, 370px';
  return <div className={paired ? 'candidate-route-photos candidate-route-photos--pair' : 'candidate-route-photos'} id="route-photos">
    {entries.map(({ file, width, height, focus, credit }) => {
      const src = `${directory}/${file}-${width}.webp`;
      const { alt, caption, detail } = copy.photos[file];
      return <figure key={file}>
        <img src={src} srcSet={`${directory}/${file}-384.webp 384w, ${src} ${width}w`}
          sizes={sizes}
          width={width} height={height} alt={alt} loading="lazy" decoding="async"
          style={focus ? { objectPosition: focus } : undefined} />
        <figcaption>
          <strong>{caption}</strong>
          <p>{detail}</p>
          {credit && <details>
            <summary>{copy.credit}</summary>
            <p><a href={credit.source}><bdi>{credit.name} · Wikimedia Commons</bdi></a> · <a href={`https://creativecommons.org/licenses/${credit.licensePath}/`}><bdi>{credit.license}</bdi></a>. {copy.adjustment}</p>
          </details>}
        </figcaption>
      </figure>;
    })}
  </div>;
}
