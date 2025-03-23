import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope, FaGlobe } from "react-icons/fa";
import Brajesh from "../Assets/Brajesh.JPG";
import Aryan from "../Assets/Aryan.webp";

const AboutUs = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const teamMembers = [
        {
            id: 1,
            name: "Brajesh Jha",
            role: "Software Engineer at Value Momentum",
            bio: "Passionate software engineer with expertise in building scalable applications. Specializes in full stack development and Python applications.",
            image: Brajesh,
            social: {
                linkedin: "https://www.linkedin.com/in/brajeshkrjha",
                github: "https://github.com/brajeshkrjha",
                email: "mailto:brajeshjha2001@gmail.com",
                portfolio: "https://brajesh.netlify.app",
            },
        },
        {
            id: 2,
            name: "Aryan Kumar",
            role: "Software Engineer at LTIMindtree",
            bio: "Full-stack developer with a focus on creating intuitive user experiences. Passionate about modern web technologies and Cloud Computing.",
            image: Aryan,
            social: {
                linkedin: "https://www.linkedin.com/in/aryank728",
                github: "https://github.com/Aryank728",
                email: "mailto:Kumararyan1929@gmail.com",
                portfolio: "https://aryankr.netlify.app",
            },
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } },
    };

    // Calculate background gradient position based on mouse movement
    const calculateGradientPosition = () => {
        const x = (mousePosition.x / window.innerWidth) * 100;
        const y = (mousePosition.y / window.innerHeight) * 100;
        return { x, y };
    };

    const gradientPos = calculateGradientPosition();

    return (
        <>
            {/* Full Page Background Animation */}
            <div className="fixed inset-0 w-full h-full overflow-hidden -z-20">
                {/* Main animated gradient background */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white to-purple-50/90"
                    style={{
                        backgroundPosition: `${gradientPos.x}% ${gradientPos.y}%`,
                        y: backgroundY
                    }}
                />
                
                {/* Decorative floating circles */}
                {[...Array(10)].map((_, index) => (
                    <motion.div
                        key={index}
                        className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10"
                        style={{
                            width: `${Math.random() * 400 + 100}px`,
                            height: `${Math.random() * 400 + 100}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: 0.3,
                        }}
                        animate={{
                            x: [0, Math.random() * 60 - 30],
                            y: [0, Math.random() * 60 - 30],
                        }}
                        transition={{
                            duration: Math.random() * 15 + 15,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                    />
                ))}
                
                {/* Decorative dots pattern overlay */}
                <div className="absolute inset-0 opacity-10" 
                    style={{
                        backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />
                
                {/* Animated light beams */}
                <motion.div 
                    className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-blue-200/20 blur-3xl rounded-full"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                <motion.div 
                    className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-purple-200/20 blur-3xl rounded-full"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                        duration: 20,
                        delay: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="relative pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 relative"
                >
                    <motion.h1 
                        className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        animate={{ 
                            backgroundPosition: [`0% 50%`, `100% 50%`, `0% 50%`] 
                        }}
                        transition={{ 
                            duration: 15, 
                            repeat: Infinity,
                            ease: "linear" 
                        }}
                        style={{ backgroundSize: "200% 200%" }}
                    >
                        About Us
                    </motion.h1>
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8 max-w-md"
                    ></motion.div>
                    <motion.p 
                        className="text-lg text-gray-700 max-w-3xl mx-auto relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        We are passionate developers dedicated to showcasing the rich cultural heritage and diversity of India.
                        Our mission is to create an immersive digital experience that educates and inspires people about India's history, traditions, and landmarks.
                    </motion.p>
                </motion.div>

                {/* Team Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 relative z-10"
                >
                    {teamMembers.map((member) => (
                        <motion.div
                            key={member.id}
                            variants={itemVariants}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-2/5 overflow-hidden">
                                    <motion.div className="relative h-full">
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <motion.div 
                                            className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0"
                                            whileHover={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.div>
                                </div>
                                <div className="md:w-3/5 p-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                                    <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                                    <p className="text-gray-600 mb-6">{member.bio}</p>
                                    <div className="flex space-x-4">
                                        <motion.a
                                            whileHover={{ y: -5, color: "#0077B5" }}
                                            href={member.social.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <FaLinkedin size={24} />
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ y: -5, color: "#333" }}
                                            href={member.social.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            <FaGithub size={24} />
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ y: -5, color: "#EA4335" }}
                                            href={member.social.email}
                                            className="text-gray-600 hover:text-red-500 transition-colors"
                                        >
                                            <FaEnvelope size={24} />
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ y: -5, color: "#4285F4" }}
                                            href={member.social.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-blue-500 transition-colors"
                                        >
                                            <FaGlobe size={24} />
                                        </motion.a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Our Story Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 bg-white/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100 relative z-10"
                >
                    <motion.div 
                        className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-100/50 blur-2xl -z-10"
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div 
                        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-purple-100/50 blur-2xl -z-10"
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 8,
                            delay: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Story</h2>
                    <div className="max-w-4xl mx-auto">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-gray-700 mb-6"
                        >
                            The "Know India" project was born from our shared passion for India's diverse culture and rich heritage.
                            As software engineers with roots in different parts of India, we wanted to create a platform that showcases
                            the beauty and diversity of our country.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-gray-700 mb-6"
                        >
                            Our journey began when we realized that many people, including Indians themselves, are unaware of the
                            incredible diversity and cultural richness that exists across different states of India. We decided to 
                            leverage our technical skills to create an interactive and educational platform.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-gray-700"
                        >
                            Today, we continue to expand and improve this platform, adding more detailed information about each state, 
                            its traditions, cuisines, festivals, and landmarks. We hope that through this project, we can inspire 
                            others to explore and appreciate the incredible tapestry that is India.
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default AboutUs;
