import Link from "next/link";

export default function ReservationBanner({
  title = "Reserve Your Evening",
  description = "Savor bold flavors, handcrafted cocktails, and a setting designed to delight every sense.",
  buttonText = "Make a Reservation",
  href = "/reserve",
  backgroundImage = "/images/res-bg.jpg", // Customize this path
}) {
  return (
    <section
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl min-h-[400px] flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 p-10 max-w-3xl mx-auto text-white">
        <p className="uppercase tracking-wider text-sm text-gold font-semibold mb-3">
          Make it a night to remember
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-md">
          {title}
        </h2>
        <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
          {description}
        </p>
        <Link href={href} passHref>
          <button
  className="
    relative
    inline-flex items-center justify-center
    px-10 py-4
    text-lg font-semibold
    text-ivory
    rounded-2xl
    bg-gradient-to-r from-burgundy to-dark-burgundy
    shadow-xl ring-1 ring-white/10 backdrop-blur-sm
    transition-all duration-300 ease-in-out
    hover:scale-105 hover:brightness-110 hover:shadow-2xl
    focus:outline-none focus:ring-4 focus:ring-gold/50
    before:absolute before:inset-0 before:rounded-2xl before:bg-white/5 before:opacity-0 hover:before:opacity-10
  "
>
  <span className="relative z-10">{buttonText}</span>
</button>
        </Link>
      </div>
    </section>
  );
}
