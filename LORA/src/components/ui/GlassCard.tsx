import React from 'react';

interface M3CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elevated' | 'filled' | 'outlined';
}

export const GlassCard: React.FC<M3CardProps> = ({
  children,
  className = '',
  variant = 'filled'
}) => {
  const variantStyles = {
    // M3 Elevated Card
    elevated: 'bg-[hsl(220,40%,10%)] border border-[hsla(210,100%,75%,0.15)] shadow-lg shadow-black/40',
    // M3 Filled Card
    filled: 'bg-[hsl(217,33%,12%)] border border-transparent',
    // M3 Outlined Card
    outlined: 'bg-[hsl(222,47%,7%)] border border-[hsla(210,100%,75%,0.2)]'
  };

  return (
    <div
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      className={`rounded-[16px] p-5 transition-all duration-200 hover:bg-[hsl(217,30%,16%)] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
