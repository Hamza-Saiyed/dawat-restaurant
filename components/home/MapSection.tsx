export default function MapSection() {
  return (
    <section className="w-full h-[400px] md:h-[500px] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50 z-10"></div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.0!2d72.5388!3d23.0009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAzLjIiTiA3MsKwMzInMTkuNyJF!5e0!3m2!1sen!2sin!4v1234567890"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="grayscale-[30%] contrast-[1.2] opacity-90"
      ></iframe>
      <div className="absolute inset-0 pointer-events-none border-t border-b border-gold/20 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"></div>
    </section>
  );
}
