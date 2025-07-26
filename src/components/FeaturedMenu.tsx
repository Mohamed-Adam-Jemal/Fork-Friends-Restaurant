import Image from 'next/image';
import Link from 'next/link';

const featuredDishes = [
  {
    id: 1,
    name: "Kebab",
    description: "Fresh Atlantic salmon with a lemon herb sauce.",
    price: "$28",
    imageSrc: "/dishes/kebab.jpg",
    href: "/menu#kebab",
  },
  {
    id: 2,
    name: "Truffle Risotto",
    description: "Creamy risotto infused with black truffle essence.",
    price: "$34",
    imageSrc: "/dishes/risotto.jpg",
    href: "/menu#truffle-risotto",
  },
  {
    id: 3,
    name: "Pasta",
    description: "Tender beef wrapped in puff pastry and mushroom duxelles.",
    price: "$42",
    imageSrc: "/dishes/pasta.jpg",
    href: "/menu#pasta",
  },
];

export default function FeaturedMenu() {
  return (
    <section className="bg-ivory text-charcoal max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold text-burgundy mb-10 text-center">Featured Menu</h2>
      <div className="grid gap-10 md:grid-cols-3 bg">
        {featuredDishes.map(({ id, name, description, price, imageSrc, href }) => (
          <Link key={id} href={href} className="group block rounded-lg shadow-lg overflow-hidden border border-transparent hover:border-gold transition">
            <div className="relative w-full h-56 md:h-48">
              <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-6 bg-ivory">
              <h3 className="text-2xl font-semibold text-burgundy mb-2">{name}</h3>
              <p className="text-sm mb-4">{description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{price}</span>
                <button className="px-4 py-2 bg-burgundy text-ivory rounded-lg border border-transparent hover:bg-dark-burgundy transition">
                  Order Now
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
