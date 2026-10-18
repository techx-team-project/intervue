interface SparklineProps {
  values: number[];
  className?: string;
}

export function Sparkline({ values, className }: SparklineProps) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);

  return (
    <div className={`flex h-8 items-end gap-0.5 ${className ?? ''}`}>
      {values.map((value, index) => (
        <div
          key={index}
          className={`w-1.5 flex-1 rounded-sm ${index === values.length - 1 ? 'bg-primary' : 'bg-primary/25'}`}
          style={{ height: `${Math.max((value / max) * 100, 8)}%` }}
        />
      ))}
    </div>
  );
}

export default Sparkline;
