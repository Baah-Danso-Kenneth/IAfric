import { littleInfoData } from "@/lib/data";
import DataForInfo from "./DataForInfo";

export function LittleInfo() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 uppercase bg-[#8338EC]"> 
      <div className="container mx-auto px-4 sm:px-6">
        {/* Heading - responsive text size and consistent width constraints */}
        <div className="flex items-center justify-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                         text-center font-play_flaire text-white 
                         max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]">
            we take you on tour to Africa using bitcoin
          </h1>
        </div>

        {/* Cards grid - progressively increases columns with proper spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 
                        gap-6 sm:gap-8 md:gap-10 
                        max-w-xs sm:max-w-2xl lg:max-w-5xl xl:max-w-7xl 
                        mx-auto">
          {littleInfoData.map(({title, description}, index) => (
            <DataForInfo
              key={index}
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}