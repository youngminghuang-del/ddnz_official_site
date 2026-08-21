import type { ComponentType, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type IconComponent = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

export function DdnzEyebrow({ children, icon: Icon, dark = false }: { children: ReactNode; icon?: IconComponent; dark?: boolean }) {
  return (
    <p className={`ddnz-eyebrow ${dark ? 'ddnz-eyebrow-dark' : ''}`}>
      {Icon ? <Icon className="h-4 w-4" aria-hidden={true} /> : null}
      <span>{children}</span>
    </p>
  );
}

export function DdnzPrimaryLink({
  to,
  children,
  onClick,
  className = '',
  tracking = false,
}: {
  to: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  tracking?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      data-analytics-tracked={tracking ? 'true' : undefined}
      className={`ddnz-button ddnz-button-primary ${className}`}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
    </Link>
  );
}

export function DdnzSecondaryLink({
  to,
  children,
  className = '',
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return <a href={to} className={`ddnz-button ddnz-button-secondary ${className}`}>{children}</a>;
}
