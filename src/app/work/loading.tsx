export default function WorkLoading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center text-text relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-muted/20 border-t-white rounded-full animate-spin" />
        <p className="text-muted text-sm tracking-[0.2em] uppercase animate-pulse">
          Loading Work...
        </p>
      </div>
    </div>
  );
}
