const services = [
    {
        id: 'installation',
        name: 'Installation Service',
        description: 'Professional installation services for your convenience.',
        details: [
             { title: 'Wallpaper Installation', description: 'Seamless wallpaper installation.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770671585/ayatrio_wallpaper_installation_a7d5mu.avif', link: '/services/Installation' },
            { title: 'Floor Installation', description: 'Expert floor installation service.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770671582/ayatrio_floor_installation_w7b9jh.avif', link: '/services/Installation' },
            { title: 'Curtains Installation', description: 'Professional curtain installation.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770671578/ayatrio_curtain_installation_qfj6cf.avif', link: '/services/Installation' },
            { title: 'Blinds Installations', description: 'Various type of blinds installation services.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770671576/ayatrio_blinds_installation_rckfnk.avif', link: '/services/Installation' }
        ]
    },
    {
        id: 'measuring',
        name: 'Measuring Service',
        description: 'Get precise measurements for your space.',
        details: [
            { title: 'Room Measuring', description: 'Detailed room measurement service.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770673869/ayatrio_living_room_g7yrsm.avif', link: '#' },
            { title: 'Floor Measuring', description: 'Accurate furniture measuring.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770671582/ayatrio_floor_installation_w7b9jh.avif', link: '#' },
            { title: 'Curtain Measuring', description: 'Tailored measuring solutions.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770671578/ayatrio_curtain_installation_qfj6cf.avif', link: '#' },
            { title: 'Wallpaper Measuring', description: 'Measure for accessories and fixtures.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770671585/ayatrio_wallpaper_installation_a7d5mu.avif', link: '#' }
        ]
    },
    {
        id: 'planning',
        name: 'Planning Service',
        description: 'Plan your space with our expert tools.',
        details: [
            { title: 'Room Planning', description: 'Detailed room planning service.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770673895/ayatrio_dining-room_jrnh8a.avif', link: '/services/Planning' },
            { title: 'Office Planning', description: 'Expert furniture placement planning.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770673899/ayatrio_home_office_vcfpzx.avif', link: '/services/Planning' },
            { title: 'Custom Planning', description: 'Personalized planning services.',  link: '/services/Planning' },
            { title: 'Accessory Planning', description: 'Plan for accessories and fixtures.',  link: '/services/Planning' }
        ]
    },
    {
        id: 'buyback',
        name: 'Buy Back Service',
        description: 'Sell back your old Ayatrio furniture easily.',
        details: [
            { title: 'Flooring Buy Back', description: 'Sell back your old furniture.', link: '/services/BuyBack' },
            { title: 'wallaper Buy Back', description: 'Return old accessories.',  link: '/services/BuyBack' },
            { title: 'Appliance Buy Back', description: 'Return old appliances.',  link: '/services/BuyBack' },
            { title: 'Custom Buy Back', description: 'Custom buy back services.',  link: '/services/BuyBack' }
        ]
    },
    {
        id: 'clickcollect',
        name: 'Click and Collect Service',
        description: 'Order online and collect in store.',
        details: [
            { title: 'Furnishing Collection', description: 'Collect your ordered furniture.',  link: '/services/ClickAndCollect' },
            { title: 'Accessory Collection', description: 'Collect your ordered accessories.',  link: '/services/ClickAndCollect' },
            { title: 'Appliance Collection', description: 'Collect your ordered appliances.',  link: '/services/ClickAndCollect' },
            { title: 'Custom Collection', description: 'Personalized collection service.', link: '/services/ClickAndCollect' }
        ]
    },
    {
        id: 'finance',
        name: 'Finance Service',
        description: 'Flexible financing options for your purchases.',
        details: [
            { title: 'Room Furnishing Financing', description: 'Finance your furniture purchases.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770673869/ayatrio_living_room_g7yrsm.avif', link: '/services/Finance' },
            { title: 'Office Furnishing Financing', description: 'Finance your accessories.', image: 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1770673899/ayatrio_home_office_vcfpzx.avif', link: '/services/Finance' },
            { title: 'Appliance Financing', description: 'Finance your appliances.',  link: '/services/Finance' },
            { title: 'Custom Financing', description: 'Personalized financing options.', link: '/services/Finance' }
        ]
    },
    {
        id: 'trackorder',
        name: 'Track and Manage My Order',
        description: 'Keep track of your orders and manage them efficiently.',
        details: [
            { title: 'Track Orders', description: 'Track your orders in real-time.', link: '/track-order' },
            { title: 'Manage Orders', description: 'Manage and modify your orders.',  link: '/track-order' },
        ]
    },
    {
        id: 'warranty',
        name: 'Warranty Service',
        description: 'Warranty services for your Ayatrio products.',
        details: [
            { title: 'Warranty Registration', description: 'Warranty for your furniture.',  link: '/warranty/registration' },
            { title: 'Warranty Claim', description: 'Warranty for your accessories.',  link: '/warranty/claim' },
        ]
    },
    {
        id: 'delivery',
        name: 'Delivery and Transport',
        description: 'Convenient delivery and transport services.',
        details: [
            { title: 'Delivery', description: 'Deliver your furniture.',  link: '#' },
            { title: 'Transport', description: 'Deliver your accessories.',  link: '#' },
        ]
    },
    {
        id: 'returns',
        name: 'Returns and Exchanges',
        description: 'Hassle-free returns and exchanges.',
        details: [
            { title: 'Return Furnishing', description: 'Return your furniture.',  link: '#' },
            { title: 'Return Accessories', description: 'Return your accessories.',  link: '#' },
            { title: 'Return Appliances', description: 'Return your appliances.',  link: '#' },
            { title: 'Custom Returns', description: 'Tailored return solutions.',  link: '#' }
        ]
    }
];

export default services;