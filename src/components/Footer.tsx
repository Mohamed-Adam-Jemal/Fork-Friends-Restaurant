import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const restaurantSections = [
  {
    title: "Menu",
    links: [
      { name: "Appetizers", href: "/menu#appetizers" },
      { name: "Main Courses", href: "/menu#main-courses" },
      { name: "Desserts", href: "/menu#desserts" },
      { name: "Drinks", href: "/menu#drinks" },
    ],
  },
  {
    title: "About Us",
    links: [
      { name: "Our Story", href: "/about" },
      { name: "Team", href: "/team" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Help & Support",
    links: [
      { name: "FAQs", href: "/faqs" },
      { name: "Reservations", href: "/reservation" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

const restaurantSocialLinks = [
  { icon: <FaInstagram className="w-5 h-5" />, href: "https://instagram.com/forkandfriends", label: "Instagram" },
  { icon: <FaFacebook className="w-5 h-5" />, href: "https://facebook.com/forkandfriends", label: "Facebook" },
  { icon: <FaTwitter className="w-5 h-5" />, href: "https://twitter.com/forkandfriends", label: "Twitter" },
  { icon: <FaLinkedin className="w-5 h-5" />, href: "https://linkedin.com/company/forkandfriends", label: "LinkedIn" },
];

const restaurantLegalLinks = [
  { name: "Terms and Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

export const Footer = ({
  logo = {
    url: "https://forkandfriends.com",
    src: "/FnF_Logo.png", // Adjust the path according to your assets
    alt: "Fork & Friends logo",
    title: "Fork & Friends",
  },
  sections = restaurantSections,
  description = "Fork & Friends is dedicated to providing an unforgettable dining experience with fresh, locally sourced ingredients and warm hospitality.",
  socialLinks = restaurantSocialLinks,
  copyright = `© ${new Date().getFullYear()} Fork & Friends. All rights reserved.`,
  legalLinks = restaurantLegalLinks,
}: FooterProps) => {
  return (
    <section className="absolute bg-white border-t border-gray-200 pt-4 w-full">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:text-left justify-between">
          <div className="flex flex-col gap-6 lg:items-start w-full lg:w-1/3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href={logo.url}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-10 w-auto"
                />
              </a>
              <h2 className="text-2xl font-semibold text-burgundy">{logo.title}</h2>
            </div>
            <p className="max-w-[90%] text-sm text-gray-600">
              {description}
            </p>
            <ul className="flex items-center space-x-6 text-gray-600">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="hover:text-burgundy transition-colors">
                  <a href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20 lg:w-2/3">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-gray-800">{section.title}</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="hover:text-burgundy transition-colors">
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-gray-200 py-6 text-xs font-medium text-gray-500 md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-burgundy transition-colors">
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
