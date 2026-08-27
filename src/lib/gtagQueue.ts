export type GtagCommand = (...args: unknown[]) => void;

export function createGtagCommandQueue(dataLayer: unknown[]): GtagCommand {
  return function gtag(..._args: unknown[]) {
    dataLayer.push(arguments);
  };
}

