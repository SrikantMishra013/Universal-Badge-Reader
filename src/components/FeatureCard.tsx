import useInView from "../hooks/useInView";

export default function FeatureSection({
  icon,
  title,
  desc,
  bgColor = "bg-white",
  reverse = false,
}: {
  icon: string;
  title: string;
  desc: string;
  bgColor?: string;
  reverse?: boolean;
}) {
  const { ref, inView } = useInView();

  return (
    <section
      className={`w-full min-h-80 rounded-lg p-6 mb-10 shadow-md transition hover:shadow-xl hover:-translate-y-1 duration-300 ${bgColor}`}
    >
      <div
        ref={ref}
        className={`container mx-auto px-6 md:px-12 transition-all duration-700 ease-out transform ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div
          className={`flex flex-col md:flex-row items-center gap-10 ${
            reverse ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="text-5xl">{icon}</div>
          <div className=" text-center md:text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            <p className="text-gray-600 text-lg text-center">{desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
