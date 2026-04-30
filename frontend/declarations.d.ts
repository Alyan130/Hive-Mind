// Type stubs for Next.js 16 modules that lack .d.ts files at package root

declare module 'next/navigation' {
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    refresh: () => void;
    back: () => void;
    forward: () => void;
    prefetch: (href: string) => void;
  };
  export function usePathname(): string;
  export function useParams(): Record<string, string | string[]>;
  export function useSearchParams(): URLSearchParams;
  export function redirect(url: string): never;
  export function notFound(): never;
}

declare module 'next' {
  export type Metadata = {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };
  export type NextConfig = Record<string, unknown>;
  export type NextPage<P = object> = React.ComponentType<P>;
}

declare module 'next/font/google' {
  interface FontOptions {
    subsets?: string[];
    weight?: string | string[];
    style?: string | string[];
    variable?: string;
    display?: string;
  }
  interface FontResult {
    className: string;
    variable: string;
    style: { fontFamily: string };
  }
  export function Inter(options?: FontOptions): FontResult;
  export function Geist(options?: FontOptions): FontResult;
  export function Geist_Mono(options?: FontOptions): FontResult;
}

declare module 'next/image' {
  import { ImgHTMLAttributes } from 'react';
  interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    quality?: number;
    placeholder?: string;
    blurDataURL?: string;
  }
  export default function Image(props: ImageProps): JSX.Element;
}

declare module 'next/link' {
  import { AnchorHTMLAttributes } from 'react';
  interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    prefetch?: boolean;
    replace?: boolean;
    scroll?: boolean;
  }
  export default function Link(props: LinkProps): JSX.Element;
}
