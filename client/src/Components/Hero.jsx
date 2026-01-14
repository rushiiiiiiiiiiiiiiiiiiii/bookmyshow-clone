import { useEffect, useState } from "react";

const BANNERS = [
  "https://www.adgully.com/img/800/201712/creative_tvc.jpg",
  "https://cdn.grabon.in/gograbon/indulge/wp-content/uploads/2023/08/ticket-purchase.jpg",
  "https://blog.releasemyad.com/wp-content/uploads/2020/07/bookmyshow.jpg",
  "https://images.freekaamaal.com/post_images/1582183521.png",
  "https://couponswala.com/blog/wp-content/uploads/2021/07/25-1-1-1024x576.jpg.webp",
  "https://in.bmscdn.com/offers/tncbanner/get-rs-100-off-on-your-tickets-take100.jpg",
  "https://cd9941cc.delivery.rocketcdn.me/wp-content/uploads/2024/06/Book-My-Show-HSBC-NEws2-Post.jpg",
  "https://bsmedia.business-standard.com/_media/bs/img/article/2016-07/05/full/1467721201-5966.jpg",
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % BANNERS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-[160px] sm:h-[220px] md:h-[300px] overflow-hidden rounded-xl">
          {BANNERS.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === active ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={img}
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
          ))}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {BANNERS.map((_, i) => (
              <span
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 w-2 rounded-full cursor-pointer ${
                  i === active ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
