import Slider from 'react-slick';
import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    name: "Wan Asmawati",
    role: "Engineer",
    company: "Petronas",
    testimonial: "The training was superb, easy to understand and the examples of event very valuable",
    image: "/testimonials/user-stroke-rounded.svg"
  },
  {
    name: "Ahmad Haziq",
    role: "Engineer",
    company: "Petronas",
    testimonial: "Its about how the engagement are being done and how well the message was delivered",
    image: "/testimonials/user-stroke-rounded.svg"
  },
  {
    name: "Wong Kai Zhao",
    role: "Engineer",
    company: "Petronas",
    testimonial: "Great instructor, I learnt a lot, thanks.",
    image: "/testimonials/user-stroke-rounded.svg"
  },
  {
    name: "Prakash Palanisamy",
    role: "Engineer",
    company: "PRefChem",
    testimonial: "The presentation style and knowlege sharing by trainer.",
    image: "/testimonials/user-stroke-rounded.svg"
  },
  {
    name: "Mohd Hafwan Affiq",
    role: "Engineer",
    company: "PRefChem",
    testimonial: "Experienced trainer and always answer all the queries",
    image: "/testimonials/user-stroke-rounded.svg"
  },
  {
    name: "Joy Ruran Baru",
    role: "Engineer",
    company: "Sarawak Energy",
    testimonial: "The simplicity of explanation by the trainer. He had portrayed an in depth understanding and knowledge of the topic. Easy to engage with the trainer.",
    image: "/testimonials/user-stroke-rounded.svg"
  },
  {
    name: "Dr Bong Yii Change",
    role: "Manager",
    company: "Sarawak Energy",
    testimonial: "Clear communication, conducive and convenient training place",
    image: "/testimonials/user-stroke-rounded.svg"
  },
  {
    name: "Dhari Abdullateef",
    role: "Supervisor",
    company: "KIPIC Kuwait",
    testimonial: "The trainer was highly knowledgeable, engaging, and supportive, making learning both enjoyable and effective.",
    image: "/testimonials/user-stroke-rounded.svg"
  },
  {
    name: "Thawab Alshahrani",
    role: "Team Leader",
    company: "Sabic, KSA",
    testimonial: "The training was highly engaging, knowledgeable, and made complex concepts easy to understand.",
    image: "/testimonials/user-stroke-rounded.svg"
  },
  {
    name: "Abdulla Dukhain",
    role: "Leader",
    company: "KIPIC, Kuwait",
    testimonial: "Invaluable insights gained, excellent delivery, engaging, and highly informative!",
    image: "/testimonials/user-stroke-rounded.svg"
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
    arrows: true,
    className: "testimonial-slider w-full max-w-6xl mx-auto px-4"
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-center items-center">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-900 mb-4">What Our Clients Say</h2>
        <p className="text-blue-800 max-w-2xl mx-auto px-4">
          Hear from organizations we've helped strengthen their skills and enhance their capabilities.
        </p>
      </div>
      <div className="w-full max-w-6xl mx-auto">
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials; 