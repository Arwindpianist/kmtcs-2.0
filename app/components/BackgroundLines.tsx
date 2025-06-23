'use client';

const BackgroundLines = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent" />
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-200/50" />
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-blue-200/50" />
    </div>
  );
};

export default BackgroundLines;