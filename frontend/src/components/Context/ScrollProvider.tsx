
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type RefObject,
  type ReactNode,
} from "react";

// ============================================================
// DHMS INTERNATIONAL
// SCROLL CONTEXT
// ============================================================

type SectionRef = RefObject<HTMLElement | null>;

interface ScrollContextProps {
  sectionRefs: SectionRef[];

  activeIndex: number;

  registerSection: (ref: SectionRef) => number;
}

const ScrollContext = createContext<
  ScrollContextProps | undefined
>(undefined);

// ============================================================
// SCROLL PROVIDER
// ============================================================

export const ScrollProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [sectionRefs, setSectionRefs] = useState<
    SectionRef[]
  >([]);

  const [activeIndex, setActiveIndex] =
    useState<number>(0);

  // ----------------------------------------------------------
  // REGISTER SECTION
  // ----------------------------------------------------------

  const registerSection = useCallback(
    (ref: SectionRef): number => {
      // Do not register an empty reference.

      if (!ref.current) {
        return -1;
      }

      // Avoid registering the same reference twice.

      const existingIndex =
        sectionRefs.indexOf(ref);

      if (existingIndex !== -1) {
        return existingIndex;
      }

      // Register the section.

      setSectionRefs((previous) => {
        // Check again using the latest state.

        if (previous.includes(ref)) {
          return previous;
        }

        return [...previous, ref];
      });

      return sectionRefs.length;
    },
    [sectionRefs]
  );

  // ----------------------------------------------------------
  // TRACK ACTIVE SECTION
  // ----------------------------------------------------------

  useEffect(() => {
    if (sectionRefs.length === 0) {
      return;
    }

    const updateActiveSection = () => {
      const scrollPosition =
        window.scrollY +
        window.innerHeight / 2;

      const index = sectionRefs.findIndex(
        (sectionRef) => {
          const element = sectionRef.current;

          if (!element) {
            return false;
          }

          const rect =
            element.getBoundingClientRect();

          const elementTop =
            rect.top + window.scrollY;

          const elementBottom =
            elementTop + rect.height;

          return (
            scrollPosition >= elementTop &&
            scrollPosition < elementBottom
          );
        }
      );

      if (index !== -1) {
        setActiveIndex((previous) =>
          previous === index
            ? previous
            : index
        );
      }
    };

    // Calculate the active section immediately.

    updateActiveSection();

    // Update during scrolling and resizing.

    window.addEventListener(
      "scroll",
      updateActiveSection,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateActiveSection
    );

    // Cleanup event listeners.

    return () => {
      window.removeEventListener(
        "scroll",
        updateActiveSection
      );

      window.removeEventListener(
        "resize",
        updateActiveSection
      );
    };
  }, [sectionRefs]);

  // ----------------------------------------------------------
  // CONTEXT VALUE
  // ----------------------------------------------------------

  const value = useMemo<ScrollContextProps>(
    () => ({
      sectionRefs,
      activeIndex,
      registerSection,
    }),
    [
      sectionRefs,
      activeIndex,
      registerSection,
    ]
  );

  // ----------------------------------------------------------
  // PROVIDER
  // ----------------------------------------------------------

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
};

// ============================================================
// USE SCROLL
// ============================================================

export const useScroll = (): ScrollContextProps => {
  const context = useContext(ScrollContext);

  if (!context) {
    throw new Error(
      "useScroll must be used within a ScrollProvider"
    );
  }

  return context;
};