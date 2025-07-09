

const RoomPageHeader = ({howMuchScrolled}) => {
  return (
    <nav 
      className="sticky top-0 border-b bg-white z-[22]" 
      aria-label="Room page navigation"
    >
      <div className="max-w-screen-xl px-2 mx-auto flex justify-between align-center">
        <div className="flex items-center">
          <ul 
            className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm"
            role="menubar"
            aria-orientation="horizontal"
          >
            <li 
              className="room-header-link-item room-page-nav-link"
              role="none"
            >
              <a 
                href="#photos-section" 
                className="text-gray-900"
                role="menuitem"
                aria-current={howMuchScrolled === 'photos' ? 'page' : undefined}
              >
                Photos
              </a>
            </li>
            <li 
              className="room-header-link-item room-page-nav-link"
              role="none"
            >
              <a 
                href="#amenities-section" 
                className="text-gray-900 dark:text-white"
                role="menuitem"
                aria-current={howMuchScrolled === 'amenities' ? 'page' : undefined}
              >
                Amenities
              </a>
            </li>
            <li 
              className="room-header-link-item room-page-nav-link"
              role="none"
            >
              <a 
                href="#reviews-section" 
                className="text-gray-900 dark:text-white"
                role="menuitem"
                aria-current={howMuchScrolled === 'reviews' ? 'page' : undefined}
              >
                Reviews
              </a>
            </li>
            <li 
              className="room-header-link-item room-page-nav-link"
              role="none"
            >
              <a 
                href="#location-section" 
                className="text-gray-900 dark:text-white"
                role="menuitem"
                aria-current={howMuchScrolled === 'location' ? 'page' : undefined}
              >
                Location
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default RoomPageHeader;
