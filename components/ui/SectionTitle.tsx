interface SectionTitleProps {
  subtitle: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export default function SectionTitle({
  subtitle,
  title,
  description,
  centered = true,
}: SectionTitleProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : "text-left"}`}>
      <span className="font-jost text-gold text-sm tracking-[0.3em] uppercase block mb-4">
        {subtitle}
      </span>
      <h2 className="font-playfair text-4xl md:text-5xl text-text-primary mb-6">
        {title}
      </h2>
      
      {/* Decorative Gold Divider inline */}
      <div className={`flex items-center ${centered ? "justify-center" : "justify-start"} mb-6`}>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold"></div>
        <div className="w-2 h-2 rounded-full border border-gold mx-2 rotate-45"></div>
        <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold"></div>
      </div>

      {description && (
        <p className="font-cormorant text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
