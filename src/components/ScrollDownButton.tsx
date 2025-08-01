import {
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ArrowPosition = 'top' | 'bottom' | 'left' | 'right';

interface ArrowButtonProps {
	className?: string;
	icon: ReactNode;
	label: string;
	position: ArrowPosition;
	onClick?: () => void;
	showLabel?: boolean;
}

interface ScrollArrowsProps {
	className?: string;
	sectionRefs: React.RefObject<HTMLElement | null>[];
	currentIndex: number;
	direction?: 'vertical' | 'horizontal';
	showLabels?: boolean;
	labels?: string[];
}

function ArrowButton({
	className,
	icon,
	label,
	position,
	onClick,
	showLabel = true,
}: ArrowButtonProps) {
	// Positioning classes
	const positionClass = {
		top: 'top-[calc(var(--navbar-height)+1rem)] left-1/2 -translate-x-1/2',
		bottom: 'bottom-4 left-1/2 -translate-x-1/2',
		left: 'left-4 top-1/2 -translate-y-1/2',
		right: 'right-4 top-1/2 -translate-y-1/2',
	}[position];

	// Motion animation based on direction
	const animationVariants = {
		initial:
			position === 'top'
				? { opacity: 0, y: -10 }
				: position === 'bottom'
				? { opacity: 0, y: 10 }
				: position === 'left'
				? { opacity: 0, x: -10 }
				: { opacity: 0, x: 10 },
		animate: { opacity: 1, x: 0, y: 0 },
		exit:
			position === 'top'
				? { opacity: 0, y: -10 }
				: position === 'bottom'
				? { opacity: 0, y: 10 }
				: position === 'left'
				? { opacity: 0, x: -10 }
				: { opacity: 0, x: 10 },
	};

	return (
		<motion.button
			initial={animationVariants.initial}
			animate={animationVariants.animate}
			exit={animationVariants.exit}
			transition={{ duration: 0.3 }}
			onClick={onClick}
			className={cn(
				'fixed z-50 group pointer-events-auto cursor-pointer',
				positionClass,
				className
			)}
		>
			<div className='relative size-12 overflow-y-clip text-center'>
				<div
					className={cn(
						'flex justify-center items-center size-12 rounded-full bg-foreground/30 border border-background backdrop-blur transition-all duration-300 absolute top-0) text-background',
						showLabel
							? 'group-hover:scale-[.60] group-hover:origin-top'
							: 'hover:opacity-60'
					)}
				>
					{icon}
				</div>
				{showLabel && (
					<div className='absolute font-bold -bottom-10 left-1/2 text-sm text-background whitespace-nowrap transition-all duration-300 transform -translate-x-1/2 group-hover:bottom-0'>
						{label}
					</div>
				)}
			</div>
		</motion.button>
	);
}

export function ScrollArrows({
	sectionRefs,
	currentIndex,
	direction = 'vertical',
	showLabels = true,
	labels,
}: ScrollArrowsProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	// Scroll to top once when component mounts
	useEffect(() => {
		if (typeof window !== 'undefined') {
			requestAnimationFrame(() => {
				if (window.scrollY !== 0) {
					window.scrollTo({ top: 0, behavior: 'auto' });
				}
			});
		}
	}, []);

	const scrollTo = (index: number) => {
		const section = sectionRefs[index]?.current;
		if (section) {
			section.scrollIntoView({ behavior: 'smooth' });
		}
	};
	// Map directions to icons + positioning
	const prevConfig =
		direction === 'vertical'
			? {
					icon: <ChevronUp className='w-5 h-5' />,
					label: showLabels ? labels?.[currentIndex - 1] || 'Up' : '',
					position: 'top',
			  }
			: {
					icon: <ChevronLeft className='w-5 h-5' />,
					label: showLabels ? labels?.[currentIndex - 1] || 'Previous' : '',
					position: 'left',
			  };

	const nextConfig =
		direction === 'vertical'
			? {
					icon: <ChevronDown className='w-5 h-5' />,
					label: showLabels ? labels?.[currentIndex + 1] || 'Down' : '',
					position: 'bottom',
			  }
			: {
					icon: <ChevronRight className='w-5 h-5' />,
					label: showLabels ? labels?.[currentIndex - 1] || 'Next' : '',
					position: 'right',
			  };

	const handlePrevScroll = () => {
		scrollTo(currentIndex - 1);
	};
	const handleNextScroll = () => {
		scrollTo(currentIndex + 1);
	};
	return (
		<div
			ref={containerRef}
			className='z-50 pointer-events-none'
		>
			<AnimatePresence>
				{currentIndex > 0 && (
					<ArrowButton
						icon={prevConfig.icon}
						label={prevConfig.label}
						position={prevConfig.position as any}
						onClick={handlePrevScroll}
						showLabel={showLabels}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{currentIndex < sectionRefs.length - 1 && (
					<ArrowButton
						icon={nextConfig.icon}
						label={nextConfig.label}
						position={nextConfig.position as any}
						onClick={handleNextScroll}
						showLabel={showLabels}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}