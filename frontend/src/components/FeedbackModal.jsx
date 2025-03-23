import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from "../context/ThemeContext";

const FeedbackModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    feedback: '',
    suggestions: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // First, add a function to store feedback locally
  const storeFeedbackLocally = (feedbackData) => {
    try {
      // Create a unique ID
      const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      // Add timestamp and ID
      const storedData = {
        ...feedbackData,
        id: feedbackId,
        timestamp: new Date().toISOString(),
        savedLocally: true
      };
      
      // Get existing feedback array or initialize empty array
      const existingFeedback = JSON.parse(localStorage.getItem('storedFeedback') || '[]');
      
      // Add new feedback to the beginning
      existingFeedback.unshift(storedData);
      
      // Limit to 20 entries to avoid storage issues
      const limitedFeedback = existingFeedback.slice(0, 20);
      
      // Save back to localStorage
      localStorage.setItem('storedFeedback', JSON.stringify(limitedFeedback));
      
      return {
        success: true,
        id: feedbackId
      };
    } catch (error) {
      console.error('Error saving feedback locally:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Then update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields before submission
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!formData.email.trim()) {
      alert('Please enter your email');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Show loading state
    setIsSubmitting(true);
    
    try {
      // Try to submit to server first
      const response = await fetch('https://know-india-final-g4rk.vercel.app/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Log the full response for debugging
      console.log('Response status:', response.status);
      
      // Parse response data
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        responseData = { 
          error: await response.text() || 'Unknown error',
          status: response.status
        };
      }
      
      // Handle different status codes
      if (response.status === 201 || response.status === 202) {
        // Success cases
        console.log('Feedback submitted successfully to server');
        showSuccess();
      } else {
        // Server error, use fallback
        console.error('Server error response:', responseData);
        
        // Store feedback locally as fallback
        const localStorageResult = storeFeedbackLocally(formData);
        
        if (localStorageResult.success) {
          console.log('Feedback saved locally as fallback');
          showSuccess('Your feedback has been saved. Thank you for your input!');
        } else {
          throw new Error('Failed to save feedback: ' + localStorageResult.error);
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      // If even the server request fails (network error), try local storage
      console.log('Attempting local storage fallback due to network error');
      const localStorageResult = storeFeedbackLocally(formData);
      
      if (localStorageResult.success) {
        console.log('Feedback saved locally after network error');
        showSuccess('Your feedback has been saved locally. Thank you!');
      } else {
        alert(`Failed to submit feedback. Please try again later. (${error.message})`);
      }
    } finally {
      // Hide loading state
      setIsSubmitting(false);
    }
  };
  
  // Helper function to show success and reset
  const showSuccess = (message) => {
    setIsSubmitted(true);
    
    // If custom message is provided, display it as an alert
    if (message) {
      setTimeout(() => {
        alert(message);
      }, 500);
    }
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        rating: 5,
        feedback: '',
        suggestions: ''
      });
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Share Your Feedback</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Thank You!</h3>
                  <p className="text-gray-600 dark:text-gray-300">Your feedback has been submitted successfully. We appreciate your input!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate your experience (1-5)</label>
                      <div className="flex space-x-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                            className="focus:outline-none"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-8 w-8 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                              fill={star <= formData.rating ? 'currentColor' : 'none'}
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                              />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What did you like about our website?</label>
                      <textarea
                        id="feedback"
                        name="feedback"
                        value={formData.feedback}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      ></textarea>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <label htmlFor="suggestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What could we improve?</label>
                      <textarea
                        id="suggestions"
                        name="suggestions"
                        value={formData.suggestions}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                      <button
                        type="submit"
                        className={`w-full px-4 py-2 text-white font-medium rounded-md ${isDark ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-500 hover:bg-orange-600'} transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          'Submit Feedback'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal; 