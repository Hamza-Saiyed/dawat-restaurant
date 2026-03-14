export default function GoldDivider() {
  return (
    <div className="w-full h-12 flex justify-center items-center my-8 opacity-70">
      <div className="w-1/3 max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>
      <div className="px-4 text-gold flex items-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block"></span>
        <span className="w-2.5 h-2.5 rounded-full border border-gold inline-block mb-1"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block"></span>
      </div>
      <div className="w-1/3 max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>
    </div>
  );
}
