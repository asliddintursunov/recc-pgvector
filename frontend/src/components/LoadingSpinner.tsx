interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = "Loading" }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-sm font-medium text-zinc-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-600" />
      <span>{label}</span>
    </div>
  );
}
