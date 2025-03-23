import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Import images correctly
import Beach from "../Assets/home/Beach.jpg";
import Heritage from "../Assets/home/Heritage.jpg";
import Mountain from "../Assets/home/Mountains.jpg";
import Religious from "../Assets/home/religion.jpg";

const slideshowImages = [Heritage, Beach, Mountain, Religious];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-0 relative w-full h-screen overflow-hidden overflow-y-hidden">
      {/* Hero Section with Slideshow */}
      <AnimatePresence>
        {slideshowImages.map((image, index) => (
          index === currentImageIndex && (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )
        ))}
      </AnimatePresence>

      {/* Blur effect for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6 md:px-12">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold"
        >
          Discover India
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-3 mb-6 text-lg md:text-xl max-w-3xl"
        >
          Explore the beauty of India's diverse landscapes, rich history, and cultural heritage.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            to="/places"
            className="mt-6 mb-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg text-lg shadow-xl transition-all"
          >
            Explore Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
