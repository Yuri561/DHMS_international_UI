import {
createContext,
useContext,
useEffect,
useState,
RefObject,
ReactNode,
} from 'react';

interface ScrollContextProps {
sectionRefs: RefObject<HTMLElement | null>[];
activeIndex: number;
registerSection: (ref: RefObject<HTMLElement | null>) => number;
}

const ScrollContext = createContext<ScrollContextProps | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
const [sectionRefs, setSectionRefs] = useState<RefObject<HTMLElement | null>[]>([]);
const [activeIndex, setActiveIndex] = useState(0);

// Register a new section
const registerSection = (ref: RefObject<HTMLElement | null>) => {
setSectionRefs((prev) => [...prev, ref]);
return sectionRefs.length;
};

useEffect(() => {
const onScroll = () => {
const scrollTop = window.scrollY + window.innerHeight / 2;
const index = sectionRefs.findIndex((ref) => {
const top = ref.current?.offsetTop ?? 0;
const height = ref.current?.offsetHeight ?? 0;
return scrollTop >= top && scrollTop < top + height;
});
if (index !== -1) setActiveIndex(index);
};
window.addEventListener('scroll', onScroll);
return () => window.removeEventListener('scroll', onScroll);
}, [sectionRefs]);

return (
<ScrollContext.Provider
value={{ sectionRefs, activeIndex, registerSection }}
>
{children}
</ScrollContext.Provider>
);
};

export const useScroll = () => {
const context = useContext(ScrollContext);
if (!context) {
throw new Error('useScroll must be used within a ScrollProvider');
}
return context;
};