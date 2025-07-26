import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

interface TestimonialItemType {
  photo: string;
  name: string;
  rating: number;
  content: string;
}

const testimonialList: TestimonialItemType[] = [
  {
    photo: "https://cdn.easyfrontend.com/pictures/testimonial/testimonial_square_1.jpeg",
    name: "Akshay Kumar",
    rating: 3.5,
    content:
      '"Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus magni tempore provident? Quaerat, dicta saepe praesentium eaque nobis corrupti aut."',
  },
  {
    photo: "https://cdn.easyfrontend.com/pictures/testimonial/testimonial_square_4.jpeg",
    name: "Rohit Verma",
    rating: 4,
    content:
      '"In praesentium eaque nobis corrupti aut, quibusdam provident consequatur. Lorem ipsum dolor sit amet consectetur."',
  },
  {
    photo: "https://cdn.easyfrontend.com/pictures/testimonial/testimonial_square_5.jpeg",
    name: "Sanjay Mehta",
    rating: 4.8,
    content:
      '"Delectus magni tempore provident? Quaerat, dicta saepe praesentium eaque nobis corrupti aut, quibusdam provident consequatur."',
  },
  {
    photo: "https://cdn.easyfrontend.com/pictures/testimonial/testimonial_square_2.jpeg",
    name: "Arjun Singh",
    rating: 5,
    content:
      '"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, dicta saepe praesentium eaque nobis corrupti aut, quibusdam provident consequatur."',
  },
  {
    photo: "https://cdn.easyfrontend.com/pictures/testimonial/testimonial_square_3.jpeg",
    name: "Arjun Kapur",
    rating: 4.5,
    content:
      '"Delectus magni tempore provident? Quaerat, dicta saepe praesentium eaque nobis corrupti aut, quibusdam provident consequatur."',
  },
  {
    photo: "https://cdn.easyfrontend.com/pictures/testimonial/testimonial_square_6.jpeg",
    name: "Vikram Desai",
    rating: 3.9,
    content:
      '"Praesentium eaque nobis corrupti aut, quibusdam provident consequatur. Lorem ipsum dolor sit amet consectetur."',
  },
];

interface RatingProps {
  rating: number;
  showLabel?: boolean;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  rating,
  showLabel = false,
  className,
}) => (
  <p className={classNames("mb-6", className)}>
    <span>
      {[...Array(5)].map((_, i) => {
        const index = i + 1;
        if (index <= Math.floor(rating)) {
          return (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className="text-yellow-500"
            />
          );
        } else if (rating > i && rating < index) {
          return (
            <FontAwesomeIcon
              key={i}
              icon={faStarHalfAlt}
              className="text-yellow-500"
            />
          );
        } else {
          return (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className="text-yellow-200 dark:text-opacity-20"
            />
          );
        }
      })}
    </span>
    {showLabel && <span>{rating.toFixed(1)}</span>}
  </p>
);

interface TestimonialItemProps {
  item: TestimonialItemType;
}

const TestimonialItem: React.FC<TestimonialItemProps> = ({ item }) => {
  const { rating, content, photo, name } = item;
  return (
    <div
      className="bg-white dark:bg-slate-800 shadow-lg rounded-[50px] p-6 mx-3 w-[300px] flex-shrink-0 
        transform transition-transform duration-300 hover:scale-105 cursor-pointer"
      style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <Rating rating={rating} showLabel={false} />
          <p className="opacity-70 mb-6 leading-relaxed">{content}</p>
        </div>
        <div className="flex items-center mt-auto">
          <img
            src={photo}
            alt={name}
            className="rounded-full border-2 border-[#B3905E]/50"
            width={48}
            height={48}
          />
          <h5 className="ml-3 text-xl font-semibold">{name}</h5>
        </div>
      </div>
    </div>
  );
};

const Testimonial: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .scroll-container {
          display: flex;
          width: calc(2 * 100%);
          animation: scroll-right 30s linear infinite;
        }
        .scroll-container:hover {
          animation-play-state: paused;
        }
        .scroll-wrapper {
          overflow: hidden;
          width: 100%;
          position: relative;
          padding: 20px 0;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
      <section className="ezy__testimonial light dark:bg-[#0b1727] text-zinc-900 dark:text-white">
        <div className="container relative">
          <div className="flex flex-col md:flex-row justify-between mb-4 md:mb-6 space-y-5 md:space-y-0">
            <div className="w-full md:w-2/3 lg:max-w-lg">
              <h2 className="font-bold text-3xl md:text-[45px] leading-none mb-6">
                What Our Clients Say
              </h2>
              <p className="text-lg leading-relaxed">
                Our clients’ success stories speak volumes — hear directly from
                those who’ve experienced real growth and transformation working
                with us.
              </p>
            </div>
          </div>

          <div className="scroll-wrapper">
            <div className="scroll-container">
              {[...testimonialList, ...testimonialList].map((item, idx) => (
                <TestimonialItem key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonial;
