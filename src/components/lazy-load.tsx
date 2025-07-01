'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  once?: boolean;
}

export function LazyLoad({
  children,
  fallback = <div className="animate-pulse bg-gray-200 h-32 w-full rounded" />,
  threshold = 0.1,
  rootMargin = '50px',
  className,
  once = true,
}: LazyLoadProps) {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            setHasLoaded(true);
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  const shouldRender = once ? hasLoaded || isInView : isInView;

  return (
    <div ref={elementRef} className={cn('min-h-0', className)}>
      {shouldRender ? children : fallback}
    </div>
  );
}

// Hook for lazy loading with intersection observer
export function useLazyLoad(options: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
} = {}) {
  const { threshold = 0.1, rootMargin = '50px', once = true } = options;
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            setHasLoaded(true);
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  const shouldLoad = once ? hasLoaded || isInView : isInView;

  return [elementRef, shouldLoad] as const;
}

// Component for lazy loading images
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100%25" height="100%25" fill="%23f3f4f6"/%3E%3C/svg%3E',
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [elementRef, shouldLoad] = useLazyLoad();

  useEffect(() => {
    if (shouldLoad && !isLoaded) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [shouldLoad, isLoaded, src]);

  return (
    <div
      ref={elementRef as any}
      className={cn('overflow-hidden', className)}
      style={{ width, height }}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300 w-full h-full object-cover',
          isLoaded ? 'opacity-100' : 'opacity-70'
        )}
        loading="lazy"
      />
    </div>
  );
}

// Lazy load wrapper for components
export function withLazyLoad<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function LazyWrappedComponent(props: P) {
    return (
      <LazyLoad fallback={fallback}>
        <Component {...props} />
      </LazyLoad>
    );
  };
}
