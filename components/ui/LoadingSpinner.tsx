export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-gold rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 m-auto w-2 h-2 bg-gold rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
