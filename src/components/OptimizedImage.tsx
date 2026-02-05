import React, { useState, useCallback } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  placeholder,
  fallback = '/placeholder.png',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setImageSrc(src);
  }, [src]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(fallback);
  }, [fallback]);

  // Load image when component mounts
  React.useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = handleLoad;
    img.onerror = handleError;
  }, [src, handleLoad, handleError]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {isLoading && placeholder && (
        <img
          src={placeholder}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(10px)',
            opacity: 0.5,
          }}
          aria-hidden="true"
        />
      )}
      <img
        src={hasError ? fallback : imageSrc || src}
        alt={alt}
        loading="lazy"
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s',
          ...props.style,
        }}
        {...props}
      />
    </div>
  );
};

export default React.memo(OptimizedImage);
