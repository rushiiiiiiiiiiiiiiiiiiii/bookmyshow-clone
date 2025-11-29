import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, ChevronUp } from 'lucide-react';

const socialIcons = [
    { icon: Facebook, link: "#" },
    { icon: Twitter, link: "#" },
    { icon: Instagram, link: "#" },
    { icon: Youtube, link: "#" },
];

const linkSections = [
    {
        title: "About",
        links: ["About Us", "Contact Us", "Careers", "Press Release", "Sitemap"],
    },
    {
        title: "Help & Support",
        links: ["FAQs", "T&Cs", "Privacy Policy", "Refund Policy", "Disclaimer"],
    },
    {
        title: "Partner with Us",
        links: ["Advertise with Us", "Film Distribution", "Affiliate Program", "List Your Show"],
    },
    {
        title: "BookMyShow Everywhere",
        links: ["Movies", "Events", "Sports", "Plays", "Activities"],
    },
];

const Footer = () => {
    // Function to scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="w-full font-sans">
            
            {/* 1. TOP CTA STRIP (Light Dark Gray - #404040) */}
            <div className="bg-[#404040] py-3 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-white text-sm">
                        <img
                            src="https://cdn-icons-png.freepik.com/512/12340/12340302.png"
                            alt="list-icon"
                            className="w-8 h-8"
                        />
                        <span className="font-semibold hidden sm:block">List Your Show</span>
                        <p className="text-gray-400 text-xs hidden sm:block">Got a show, event, activity or a great experience? Partner with us & get listed on BookMyShow</p>
                    </div>
                    
                    <button className="bg-[#f84464] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#e43a57] transition">
                        Contact Today!
                    </button>
                </div>
            </div>

            {/* 2. MIDDLE SECTION (Deep Dark Gray - #383838) */}
            <div className="bg-[#383838] py-8 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Link Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 border-b border-gray-600 pb-6 mb-6">
                        {linkSections.map((section) => (
                            <div key={section.title} className="text-sm">
                                <h4 className="font-bold text-gray-200 mb-3">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.links.map((link) => (
                                        <li key={link}>
                                            <a 
                                                href="#" 
                                                className="text-gray-400 hover:text-[#f84464] transition text-xs block"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                
                                </ul>
                            </div>
                        ))}
                        {/* Empty column for better spacing on larger screens */}
                        <div className="hidden lg:block"></div> 
                    </div>

                    {/* Social Icons & Scroll Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-4">
                        {/* BookMyShow Logo */}
                        <div className="mb-4 sm:mb-0">
                            <img
                                src="https://in.bmscdn.com/webin/common/icons/logo.svg"
                                alt="BMS"
                                className="w-24 h-8 object-contain filter brightness-0 invert opacity-60"
                            />
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 mb-4 sm:mb-0">
                            {socialIcons.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <a 
                                        key={index}
                                        href={item.link} 
                                        className="text-gray-400 hover:text-[#f84464] transition p-2 rounded-full border border-gray-600 hover:border-[#f84464] w-10 h-10 flex items-center justify-center"
                                        aria-label={item.icon.name}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                        
                        {/* Scroll to Top Button */}
                        <button 
                            onClick={scrollToTop}
                            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white transition p-2 rounded-md bg-gray-600 hover:bg-gray-700"
                        >
                            <ChevronUp size={16} />
                            <span>BACK TO TOP</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. BOTTOM COPYRIGHT STRIP (Very Dark Gray - #222222) */}
            <div className="bg-[#222222] py-6 text-gray-500 text-center text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="mb-1">
                        Copyright 2025 © BookMyShow Clone. All Rights Reserved. The content and images used on this site are for illustrative and academic purposes only.
                    </p>
                    <p className="mt-2 text-gray-600">
                        Made by a Large Language Model. Unauthorized reproduction is strictly prohibited.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;