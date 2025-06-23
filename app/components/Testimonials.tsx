'use client';

import Slider from 'react-slick';
import TestimonialCard from './TestimonialCard';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    quote: "Experienced trainer and always answer all the queries.",
    name: "Mohd Hafizan Arifin",
    company: "Engineer, ELP-GTR"
  },
  {
    quote: "The training was very informative and well-presented. I learned a lot that I can apply to my work.",
    name: "Sarah Chen",
    company: "Project Manager, TechForward"
  },
  {
    quote: "A fantastic course with a knowledgeable instructor. The practical examples were extremely helpful.",
    name: "David Lee",
    company: "Lead Developer, Innovate Solutions"
  }
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "ease-in-out",
    arrows: false,
    appendDots: (dots: any) => (
      <div className="pt-8">
        <ul className="m-0 flex justify-center items-center"> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div className="w-3 h-3 rounded-full bg-gray-400 transition-all duration-300 hover:bg-blue-500 slick-active:bg-blue-600"></div>
    )
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          What Our Clients Say
        </h2>
        <div className="max-w-3xl mx-auto">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 