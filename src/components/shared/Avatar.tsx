interface AvatarProps {
  name: string;
  color: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const SIZE_MAP = {
  xs: { wh: 20, font: 9 },
  sm: { wh: 26, font: 11 },
  md: { wh: 32, font: 13 },
};

export function Avatar({ name, color, size = 'sm', className = '' }: AvatarProps) {
  const { wh, font } = SIZE_MAP[size];
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold select-none shrink-0 ${className}`}
      style={{
        width: wh,
        height: wh,
        fontSize: font,
        backgroundColor: `${color}22`,
        color,
        border: `1.5px solid ${color}55`,
        fontFamily: 'var(--font-mono)',
      }}
      title={name}
    >
      {initials}
    </div>
  );
}