import { useEffect, useCallback, useState } from 'react';

// Performance monitoring and optimization hook
export const usePerformanceOptimization = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    isOptimal: true
  });

  // Debounce function for expensive operations
  const useDebounce = (callback: Function, delay: number) => {
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    return useCallback((...args: any[]) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        callback(...args);
      }, delay);

      setDebounceTimer(timer);
    }, [callback, delay, debounceTimer]);
  };

  // Lazy loading for images and components
  const useLazyLoading = (ref: React.RefObject<HTMLElement>) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(ref.current);

      return () => observer.disconnect();
    }, [ref]);

    return isVisible;
  };

  // API request optimization with caching
  const useOptimizedAPI = () => {
    const cache = new Map();

    const fetchWithCache = useCallback(async (url: string, options?: RequestInit) => {
      const cacheKey = url + JSON.stringify(options);
      
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        cache.set(cacheKey, data);
        
        // Cache expiry (5 minutes)
        setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
        
        return data;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    }, []);

    return { fetchWithCache };
  };

  // Performance monitoring
  useEffect(() => {
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;

        setPerformanceMetrics({
          loadTime,
          renderTime,
          isOptimal: loadTime < 3000 && renderTime < 1000
        });

        // Log performance metrics in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Metrics:', {
            'Page Load Time': `${loadTime}ms`,
            'DOM Render Time': `${renderTime}ms`,
            'Is Optimal': loadTime < 3000 && renderTime < 1000
          });
        }
      }
    };

    // Measure after page is fully loaded
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  // Preload critical resources
  const preloadResource = useCallback((url: string, type: 'script' | 'style' | 'image' | 'fetch') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'image':
        link.as = 'image';
        break;
      case 'fetch':
        link.as = 'fetch';
        link.crossOrigin = 'anonymous';
        break;
    }
    
    document.head.appendChild(link);
  }, []);

  // Connection optimization
  const optimizeConnection = useCallback(() => {
    // DNS prefetch for external domains
    const domains = [
      '//fonts.googleapis.com',
      '//api.dental-clinic.com'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);

  // Initialize optimizations
  useEffect(() => {
    optimizeConnection();
    
    // Preload critical resources
    preloadResource('/api/patients', 'fetch');
    preloadResource('/api/appointments', 'fetch');
  }, [optimizeConnection, preloadResource]);

  return {
    performanceMetrics,
    useDebounce,
    useLazyLoading,
    useOptimizedAPI,
    preloadResource
  };
};

// React Query optimization for dental clinic
export const dentalQueryConfig = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000)
  },
  mutations: {
    retry: 2
  }
};

// Service Worker registration for caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

export default usePerformanceOptimization;
