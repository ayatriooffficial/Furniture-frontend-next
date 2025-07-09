import Image from 'next/image';
import Link from 'next/link';
import temp from '../../public/product/room.jpg';

const RoomTypes = () => {
    const roomOptions = ["Living Room", "Bedroom", "Dining Room", "Bathroom", "Balcony", "Office Room", "Guest Room", "Pooja Room", "Kids Room", "Kitchen"];

    return (
        <section className="pt-12 bg-white sm:px-[50px] px-[20px]">
          <div className="mb-2 w-full flex justify-between items-center">
            <h2 className="font-semibold text-2xl py-[15px]">Room Types</h2>
          </div>
          <div className="flex flex-wrap">
            {roomOptions.map((room, index) => (
              <article key={index} className="w-1/5 p-4">
                <Link href={`/${room.replace(/\s+/g, '-')}/rooms`} passHref>
                  <div className="flex rounded-md overflow-hidden">
                    <figure>
                      <Image 
                        loading="lazy" 
                        src={temp} 
                        className="w-16 h-16 object-cover rounded-md" 
                        alt={room || "room"} 
                      />
                    </figure>
                    <div className="p-2">
                      <h3 className="text-lg font-semibold text-gray-900">{room}</h3>
                      <p className="text-sm text-gray-500">Description</p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      );
};

export default RoomTypes;
