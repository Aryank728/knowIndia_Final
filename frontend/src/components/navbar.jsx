import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, MessageSquare, Home, Book, Users, Phone } from "lucide-react";
import logo from "../Assets/logo.png";
import FeedbackModal from "./FeedbackModal";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", path: "/", icon: <Home size={18} className="mr-1" /> },
        { name: "Constitution", path: "/constitution", icon: <Book size={18} className="mr-1" /> },
        { name: "About Us", path: "/aboutus", icon: <Users size={18} className="mr-1" /> },
        { name: "Contact Us", path: "/contactus", icon: <Phone size={18} className="mr-1" /> }
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full px-6 py-3 z-40 transition-all duration-300 ${
                    isScrolled ? "bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-lg" : "bg-transparent dark:bg-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/">
                            <img src={logo} alt="Logo" className="h-12 w-auto" />
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                            >
                                <Link
                                    to={item.path}
                                    className="flex items-center relative text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-lg font-medium group transition-all duration-300"
                                >
                                    {item.icon}
                                    {item.name}
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </motion.div>
                        ))}
                        
                        {/* Feedback Button */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * navItems.length, duration: 0.5 }}
                        >
                            <button
                                onClick={() => setIsFeedbackOpen(true)}
                                className="flex items-center text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-lg font-medium group transition-all duration-300"
                            >
                                <MessageSquare size={18} className="mr-1" />
                                Feedback
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                            </button>
                        </motion.div>
                        
                        {/* Theme Toggle */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (navItems.length + 1), duration: 0.5 }}
                            className="flex items-center ml-2"
                        >
                            <ThemeToggle />
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        {/* Mobile Theme Toggle */}
                        <div className="mr-4">
                            <ThemeToggle />
                        </div>
                        
                        {/* Mobile Feedback Button */}
                        <button 
                            onClick={() => setIsFeedbackOpen(true)}
                            className="mr-4 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <MessageSquare size={24} />
                        </button>
                        
                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? 
                                <X size={28} className="text-gray-900 dark:text-gray-100" /> : 
                                <Menu size={28} className="text-gray-900 dark:text-gray-100" />
                            }
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden flex flex-col space-y-4 mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg p-4 rounded-lg"
                    >
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className="flex items-center text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-lg font-medium transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </nav>
            
            {/* Feedback Modal */}
            <FeedbackModal 
                isOpen={isFeedbackOpen} 
                onClose={() => setIsFeedbackOpen(false)} 
            />
        </>
    );
};

export default Navbar;
