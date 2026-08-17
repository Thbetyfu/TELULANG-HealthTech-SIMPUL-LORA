import React from 'react';

type BadgeVariant = 'cluster1' | 'cluster2' | 'cluster3' | 'pending' | 'delivered';

interface M3BadgeProps {
  variant: BadgeVariant;
  label: string;
}

export const GlassBadge: React.FC<M3BadgeProps> = ({ variant, label }) => {
  // Material 3 Tonal Container Roles
  const variantStyles: Record<BadgeVariant, string> = {
    cluster1: 'bg-[hsl(174,80%,18%)] text-[hsl(174,100%,80%)] border border-[hsl(174,100%,41%,0.3)]',
    cluster2: 'bg-[hsl(38,90%,18%)] text-[hsl(38,100%,80%)] border border-[hsl(38,92%,50%,0.3)]',
    cluster3: 'bg-[hsl(346,80%,18%)] text-[hsl(346,100%,80%)] border border-[hsl(346,84%,61%,0.3)]',
    pending: 'bg-[hsl(190,80%,18%)] text-[hsl(190,100%,80%)] border border-[hsl(190,95%,50%,0.3)]',
    delivered: 'bg-[hsl(174,80%,18%)] text-[hsl(174,100%,80%)] border border-[hsl(174,100%,41%,0.3)]'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
};
