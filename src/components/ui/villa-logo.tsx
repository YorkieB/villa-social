export function VillaLogo({ className = '', size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 36 36'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      {/* Outer signal arc left */}
      <path
        d='M4 18 C4 10, 10 4, 18 4'
        stroke='#f59e0b'
        strokeWidth='2.5'
        strokeLinecap='round'
        opacity='0.4'
      />
      {/* Outer signal arc right */}
      <path
        d='M32 18 C32 10, 26 4, 18 4'
        stroke='#f59e0b'
        strokeWidth='2.5'
        strokeLinecap='round'
        opacity='0.4'
      />
      {/* Mid signal arc left */}
      <path
        d='M8 20 C8 13, 12.5 8.5, 18 8'
        stroke='#f59e0b'
        strokeWidth='2.5'
        strokeLinecap='round'
        opacity='0.65'
      />
      {/* Mid signal arc right */}
      <path
        d='M28 20 C28 13, 23.5 8.5, 18 8'
        stroke='#f59e0b'
        strokeWidth='2.5'
        strokeLinecap='round'
        opacity='0.65'
      />
      {/* V shape */}
      <path
        d='M10 12 L18 28 L26 12'
        stroke='#f59e0b'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      {/* Centre dot */}
      <circle cx='18' cy='28' r='1.5' fill='#f59e0b' />
    </svg>
  );
}
