"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ChatPrompt = () => {
    const [showContent, setShowContent] = useState(true);
    const [isRendered, setIsRenderd] = useState(false)



    useEffect(() => {
        setIsRenderd(true)
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowContent(false);
            } else {
                setShowContent(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!isRendered) {
        return null;
    }

    return (
        <Link
            href="https://api.whatsapp.com/send?phone=916291531025"
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center lg:right-6 right-7 bottom-4 lg:bottom-3.5 gap-[8px] rounded-lg fixed z-50 ${!showContent && 'lg:mr-2.5 lg:mb-1.5'
                }`}
        >
            <div className="ripple-container">
                <div className="ripple-layer layer1"></div>
                <div className="ripple-layer layer2"></div>
                <div className="ripple-layer layer3"></div>
                <Image
                    loading="lazy"
                    src="/images/customer-service.avif"
                    width={45}
                    height={45}
                    alt="store chat"
                    className="lg:w-[50px] w-[45px] h-[45px] lg:h-[50px] rounded-full border-[1.5px] border-white bg-[#FFD209] z-[999]"
                    style={{ boxShadow: '0 3px 6px 2px #00000014' }}
                />
            </div>
        </Link>

    );
};

export default ChatPrompt;