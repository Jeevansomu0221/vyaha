// src/components/HeroSection.tsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./HeroSection.css";

// Import images
import hero1 from "../assets/hero/herosec1.png";
import hero2 from "../assets/hero/herosec2.png";
import hero3 from "../assets/hero/herosec3.png";

const HeroSection: React.FC = () => {
  const slides = [
    { id: 1, img: hero1 },
    { id: 2, img: hero2 },
    { id: 3, img: hero3 },
  ];

  return (
    <section className="hero-section">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-slide">
              <img src={slide.img} alt={`Hero ${slide.id}`} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;
