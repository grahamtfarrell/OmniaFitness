import Proximate from "@/components/variable-proximity/Proximate";

export default function Marquee() {
  const text = "welcome to omnia. get it.";

  return (
    <div className="bg-white py-2 border-y border-black overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {/* Repeat text multiple times for seamless loop */}
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="text-black text-[calc(1.125rem*0.75)] md:text-[calc(1.5rem*0.75)] font-mono tracking-wide mx-20"
          >
            <Proximate>{text}</Proximate>
          </span>
        ))}
      </div>
    </div>
  );
}
