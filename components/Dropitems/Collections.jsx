import './style.css'

const collections = [
  'Fornasetti Senza Tempo II',
  'The Gardens',
  'Stella McCartney x Cole & Son',
  'Ardmore - Jabula',
  'Fornasetti',
];

const Collections = () => {
  return (
    <div className='filter_item space-y-10'>
      <h4 className='filter_heading gray-text'>SHOP BY COLLECTION</h4>
      <div className='filter_content'>
        <ul className='filter_content_list'>
          {collections.map((item) => (
            <li><a href='#'>{item}</a></li>
          ))}
        </ul>
      </div>
      
      <p className='gray-text cursor-pointer'>12 More</p>
      <p>All Collections</p>
    </div>
  );
};

export default Collections;
