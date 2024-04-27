import { useEffect, useState } from 'react';

export function useLazyLoad(ref, callback) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;

    if (!loaded) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            callback();
            setLoaded(true)
            observer.unobserve(currentRef);
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1,
        }
      );
  
      if (currentRef) {
        observer.observe(currentRef);
      }
  
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }
  },[loaded, callback, ref]);

  return loaded
};

