'use client';

import Slider from 'react-slick';
import TestimonialCard from './TestimonialCard';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    quote: "The training was superb, easy to understand and the examples of event very valuable",
    name: "Wan Asmawati",
    company: "Engineer, Petronas"
  },
  {
    quote: "Its about how the engagement are being done and how well the message was delivered",
    name: "Ahmad Haziq",
    company: "Engineer, Petronas"
  },
  {
    quote: "Great instructor, I learnt a lot, thanks.",
    name: "Wong Kai Zhao",
    company: "Engineer, Petronas"
  },
  {
    quote: "The presentation style and knowlege sharing by trainer.",
    name: "Prakash Palanisamy",
    company: "Engineer, PRefChem"
  },
  {
    quote: "Experienced trainer and always answer all the queries",
    name: "Mohd Hafwan Affiq",
    company: "Engineer, PRefChem"
  },
  {
    quote: "The simplicity of explanation by the trainer. He had portrayed an in depth understanding and knowledge of the topic. Easy to engage with the trainer.",
    name: "Joy Ruran Baru",
    company: "Engineer, Sarawak Energy"
  },
  {
    quote: "Clear communication, conducive and convenient training place",
    name: "Dr Bong Yii Change",
    company: "Manager, Sarawak Energy"
  },
  {
    quote: "The trainer was highly knowledgeable, engaging, and supportive, making learning both enjoyable and effective.",
    name: "Dhari Abdullateef",
    company: "Supervisor, KIPIC Kuwait"
  },
  {
    quote: "The training was highly engaging, knowledgeable, and made complex concepts easy to understand.",
    name: "Thawab Alshahrani",
    company: "Team Leader, Sabic, KSA"
  },
  {
    quote: "Invaluable insights gained, excellent delivery, engaging, and highly informative!",
    name: "Abdulla Dukhain",
    company: "Leader, KIPIC, Kuwait"
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
    <section className="bg-background-secondary py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">
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