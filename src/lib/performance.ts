// Performance monitoring utilities

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Mark the start of a performance measurement
  mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`);
    }
  }

  // Mark the end and measure performance
  measure(name: string): number | null {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`);
      window.performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = window.performance.getEntriesByName(name)[0];
      const duration = measure?.duration || 0;
      
      this.metrics.set(name, duration);
      return duration;
    }
    return null;
  }

  // Get all recorded metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
  }

  // Log performance metrics to console (development only)
  logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Metrics');
      this.metrics.forEach((duration, name) => {
        console.log(`${name}: ${duration.toFixed(2)}ms`);
      });
      console.groupEnd();
    }
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  const startMeasure = (name: string) => {
    monitor.mark(name);
  };

  const endMeasure = (name: string) => {
    return monitor.measure(name);
  };

  const getMetrics = () => {
    return monitor.getMetrics();
  };

  return { startMeasure, endMeasure, getMetrics };
}

// Web Vitals monitoring
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
  
  // In production, you might want to send this to an analytics service
  // analytics.track('Web Vital', metric);
}

// Bundle size analyzer utility
export function analyzeBundleSize() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Bundle analyzer available in development mode');
    // Dynamic import would be used in webpack config instead
  }
}

// Memory usage monitoring
export function getMemoryUsage(): any | null {
  if (typeof window !== 'undefined' && 'memory' in window.performance) {
    return (window.performance as any).memory;
  }
  return null;
}

// Cache performance utilities
export class CacheManager {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static set(key: string, data: any, ttlMinutes: number = 5): void {
    const ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
    CacheManager.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  static get<T>(key: string): T | null {
    const item = CacheManager.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      CacheManager.cache.delete(key);
      return null;
    }

    return item.data;
  }

  static clear(): void {
    CacheManager.cache.clear();
  }

  static size(): number {
    return CacheManager.cache.size;
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, item] of CacheManager.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        CacheManager.cache.delete(key);
      }
    }
  }
}

// Debounced function utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttled function utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallTime >= delay) {
      lastCallTime = now;
      func(...args);
    }
  };
}
