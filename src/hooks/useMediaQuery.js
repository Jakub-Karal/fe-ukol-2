import { useState, useEffect } from "react";

export const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
};

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export function useBreakpoint() {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.tablet - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`
  );
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.desktop}px)`);

  return {
    isMobile,
    isTablet,
    isDesktop,
    device: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
  };
}
