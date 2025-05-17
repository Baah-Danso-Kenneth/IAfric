import DestinationCard from "@/components/content/cards/DestinationCard";
import { Button } from "@/components/ui/button";
import { whereweGoData } from "@/lib/data";

export function WhereWeGo() {
  return ( 
    <section className="py-16 md:py-20 lg:py-24 bg-[#c5e7c0]">
  
      <div className="container mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl uppercase  text-[#8338EC] inline-block relative">
            <span className="relative z-10">Tour in Africa</span>
          </h2>
        </div>
        
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10 justify-items-center">
            {whereweGoData.map(({name, image}, index) => (
              <div className="transform transition duration-300 hover:-translate-y-2 w-full flex justify-center" key={index}>
                <DestinationCard 
                  image={image} 
                  name={name} 
                />
              </div>
            ))}
          </div>
        </div>
        

        <div className="mt-14 md:mt-16 lg:mt-20 text-center">
          <Button 
            className="p-5 text-base sm:text-lg bg-[#8338EC] hover:bg-[#7029d6] text-white rounded-lg shadow-lg transition-all duration-300 font-medium transform hover:scale-105  tracking-wide"
          >
            Check out trip calendar
          </Button>
        </div>
      </div>
    </section>
  );
}