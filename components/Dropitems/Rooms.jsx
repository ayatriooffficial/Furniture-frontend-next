import './style.css'
const rooms = ['Lounge', 'Kitchen', 'Powder Room', 'Bedroom', 'Office'];

const Rooms = () => {
  return (
    <div className='filter_item space-y-10'>
      <h4 className='filter_heading gray-text'>SHOP BY ROOM</h4>
      <div className='filter_content'>
        <ul className='filter_content_list'>
          {rooms.map((room) => (
            <li><a href='#'>{room}</a></li>
          ))}
        </ul>
      </div>
      <p className='gray-text cursor-pointer'>3 More</p>
      <p>All Rooms</p>
    </div>
  );
};

export default Rooms;
