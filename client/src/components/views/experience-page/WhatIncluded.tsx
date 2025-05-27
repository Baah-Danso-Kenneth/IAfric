import { WhatIncludedProps } from "@/types/api.ds";

function WhatIncluded({ data }: WhatIncludedProps) {


  if (!data) {
    return null;
  }
  
  return (
    <section className='py-16 lg:py-24 bg-texture bg-electricPurple'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* What's Included Section */}
        {data.included_items && data.included_items.length > 0 && (
          <div className='mb-16'>
            <div className='text-center mb-12'>
              <h2 className="text-white text-3xl lg:text-4xl uppercase mb-4">
                What's Included
              </h2>
              <div className='w-24 h-1 bg-white/30 mx-auto'></div>
            </div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl mx-auto'>
              {data.included_items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-green-400 text-xl font-bold mt-1 flex-shrink-0">•</span>
                    <span className="text-white text-base lg:text-lg font-medium leading-relaxed">
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Not Included Section */}
        {data.not_included_items && data.not_included_items.length > 0 && (
          <div>
            <div className='text-center mb-12'>
              <h2 className="text-white text-3xl lg:text-4xl uppercase mb-4">
                What's Not Included
              </h2>
              <div className='w-24 h-1 bg-white/30 mx-auto'></div>
            </div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl mx-auto'>
              {data.not_included_items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-red-400 text-xl font-bold mt-1 flex-shrink-0">•</span>
                    <span className="text-white text-base lg:text-lg font-medium leading-relaxed">
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!data.included_items || data.included_items.length === 0) && 
         (!data.not_included_items || data.not_included_items.length === 0) && (
          <div className='text-center py-12'>
            <p className='text-white/60 text-lg'>
              Package details will be available soon.
            </p>
          </div>
        )}
        
      </div>
    </section>
  );
}

export default WhatIncluded;