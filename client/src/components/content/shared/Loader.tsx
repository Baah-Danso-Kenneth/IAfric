import Image from 'next/image';

function Loader() {
  return (
    <div className="fixed inset-0 w-full h-[100vh] bg-[#8338EC] z-50">
      <div className="grid place-content-center w-full h-full">
        <Image
          src="/images/loader-img.svg"
          alt="loader-img"
          width={300} 
          height={300} 
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default Loader;
