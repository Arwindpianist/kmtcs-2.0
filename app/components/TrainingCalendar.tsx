// app/components/TrainingCalendar.tsx
'use client';

const TrainingCalendar = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Upcoming Trainings</h2>
        <div className="flex justify-center">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=info%40kmtcs.com.my&ctz=Asia%2FKuala_Lumpur"
            style={{ border: 0 }}
            width="800"
            height="600"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default TrainingCalendar;
