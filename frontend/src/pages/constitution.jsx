import { motion } from "framer-motion";
import React from "react";
import constitutionPdf from "../Assets/Constitution.pdf"; // Import the constitution PDF file

const Constitution = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 z-0">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px"
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header with Decorative Elements */}
          <div className="relative mb-16 text-center">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-600"></div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mt-6 mb-3 text-gray-800 dark:text-white"
            >
              Our Constitution
            </motion.h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The rulebook that guides our country and protects our rights
            </p>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-600 mt-4"></div>
          </div>

          {/* What is the Constitution - Simplified */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border-t-4 border-amber-500 hover:shadow-xl transition-shadow duration-300 mb-8"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">What is the Constitution?</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
              Think of the Constitution as a rulebook for our country. It tells us:
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-lg">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                How our government works
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                What rights we have as citizens
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                What responsibilities we have to our country
              </li>
            </ul>
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Fun fact:</span> Our Constitution came into effect on January 26, 1950. That's why we celebrate Republic Day on this date every year!
              </p>
            </div>
          </motion.div>

          {/* Rights and Duties - Simplified */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-700"></div>
              
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#smallGrid)" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
                </div>
                <p className="text-white/90 mb-4 text-lg">
                  These are the things that the Constitution promises to protect for all citizens:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start text-white/90 text-lg">
                    <svg className="h-5 w-5 text-white mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Right to Equality - Everyone is equal before the law</span>
                  </li>
                  <li className="flex items-start text-white/90 text-lg">
                    <svg className="h-5 w-5 text-white mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Right to Freedom - Freedom to speak, move around, and choose your job</span>
                  </li>
                  <li className="flex items-start text-white/90 text-lg">
                    <svg className="h-5 w-5 text-white mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Right against Exploitation - No one can force you to work</span>
                  </li>
                  <li className="flex items-start text-white/90 text-lg">
                    <svg className="h-5 w-5 text-white mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Right to Freedom of Religion - Freedom to follow any religion</span>
                  </li>
                  <li className="flex items-start text-white/90 text-lg">
                    <svg className="h-5 w-5 text-white mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Right to Education - Free education for children between 6-14 years</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600"></div>
              
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="10" style={{ stroke: 'white', strokeWidth: 1 }} />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Your Duties</h2>
                </div>
                <p className="text-white/90 mb-4 text-lg">
                  These are things that the Constitution expects all citizens to do:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start text-white/90 text-lg">
                    <svg className="h-5 w-5 text-white mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Respect the national flag and national anthem</span>
                  </li>
                  <li className="flex items-start text-white/90 text-lg">
                    <svg className="h-5 w-5 text-white mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Protect the unity of India</span>
                  </li>
                  <li className="flex items-start text-white/90 text-lg">
                    <svg className="h-5 w-5 text-white mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Protect the environment and wildlife</span>
                  </li>
                  <li className="flex items-start text-white/90 text-lg">
                    <svg className="h-5 w-5 text-white mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Be kind to all people and respect everyone</span>
                  </li>
                  <li className="flex items-start text-white/90 text-lg">
                    <svg className="h-5 w-5 text-white mr-2 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Help children get education</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* How Our Government Works - Simplified */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border-t-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300 mb-16"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">How Our Government Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
                <h3 className="font-medium text-indigo-800 dark:text-indigo-300 text-lg mb-2">Parliament</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Makes laws for the whole country. It's like the rule-makers for India.
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
                <h3 className="font-medium text-indigo-800 dark:text-indigo-300 text-lg mb-2">Government</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Runs the country day-to-day. The Prime Minister leads the government.
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
                <h3 className="font-medium text-indigo-800 dark:text-indigo-300 text-lg mb-2">Courts</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Make sure everyone follows the laws. The Supreme Court is the highest court.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-xl shadow-lg p-6 md:p-8 mb-16"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Fun Facts About Our Constitution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-white text-lg">
                  Dr. B.R. Ambedkar is known as the "Father of the Indian Constitution"
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-white text-lg">
                  It took 2 years, 11 months and 17 days to complete the Constitution
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-white text-lg">
                  The original Constitution was handwritten and beautifully decorated by artists
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-white text-lg">
                  It is the longest written constitution of any country in the world
                </p>
              </div>
            </div>
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Left side with image/pattern */}
              <div className="hidden md:block relative bg-gradient-to-br from-amber-500 to-orange-600">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="smallGridDownload" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#smallGridDownload)" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              
              {/* Right side with content */}
              <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Want to Learn More?</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Download the complete Constitution of India to explore all articles, amendments, and provisions in detail. Perfect for students, researchers, and anyone interested in understanding our country's foundational document.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a 
                    href={constitutionPdf} 
                    download="Indian_Constitution.pdf"
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg text-lg shadow-md transition-all w-full sm:w-auto justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </a>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">PDF format • ~4.2 MB</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-center text-gray-500 dark:text-gray-400 text-sm"
          >
            <p>This simplified guide is meant for educational purposes. For legal reference, always consult the official Constitution document.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Constitution; 