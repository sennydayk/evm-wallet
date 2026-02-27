import { useCallback, useEffect, useRef, useState } from 'react';

const COPIED_DURATION_MS = 2000;

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    setCopied(true);
    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false);
      copyTimeoutRef.current = null;
    }, COPIED_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  return { copied, copyToClipboard };
};
