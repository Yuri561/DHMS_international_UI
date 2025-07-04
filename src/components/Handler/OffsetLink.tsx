import React from 'react';
import { scrollWithOffset } from '@/scrollHelpers/ScrollOffset';
import { HashLink } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx'; // Optional, for clean class merging

interface OffsetLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const OffsetLink: React.FC<OffsetLinkProps> = ({ to, children, className }) => {
  const location = useLocation();

  // Normalize the pathname (ignore hash if needed)
  const currentPath = location.pathname + location.hash;
  const isActive = currentPath === to;

  const combinedClassName = clsx(
    className,
    isActive && 'bg-white text-black font-semibold shadow-md'
  );

  return (
    <HashLink to={to} scroll={scrollWithOffset} className={combinedClassName}>
      {children}
    </HashLink>
  );
};

export default OffsetLink;
