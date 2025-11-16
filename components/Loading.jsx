// Loading component with spinner animation
export default function Loading() {
  return (
    <div className="mt-6 text-center fade-in">
      <div className="inline-flex items-center gap-3 glass-effect rounded-xl px-6 py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
        <span>Scanning coins...</span>
      </div>
    </div>
  );
}