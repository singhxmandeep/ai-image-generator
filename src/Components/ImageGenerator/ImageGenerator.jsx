import React, { useRef, useState } from 'react';
import './ImageGenerator.css'; // Import CSS file for component styles
import default_image from '../Assets/AI-image.png'; // Import default image asset

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState('/'); // State to hold generated image URL
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [loadingProgress, setLoadingProgress] = useState(0); // State to manage loading progress
  const inputRef = useRef(null); // Reference to input element for image description

  // Function to handle image generation
  const imageGenerator = async () => {
    const inputValue = inputRef.current.value.trim(); // Get input value
    if (!inputValue) {
      alert('Please enter a prompt to generate an image.'); // Alert if input is empty
      return;
    }

    setLoading(true); // Set loading state to true
    setLoadingProgress(0); // Reset progress bar to 0%

    // Simulate loading progress
    simulateProgress();

    try {
      // Call OpenAI API to generate image
      const response = await fetch(
        'https://api.openai.com/v1/images/generations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // API authorization header
          },
          body: JSON.stringify({
            prompt: inputValue,
            n: 1,
            size: '512x512',
          }),
        }
      );

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from API:', errorData);
        throw new Error(`Failed to generate image: ${errorData.error.message}`);
      }

      // Parse response data and set image URL
      const data = await response.json();
      setImageUrl(data.data[0].url);
    } catch (error) {
      console.error('Error generating image:', error);
      alert(`There was an error generating the image: ${error.message}`);
    } finally {
      setLoading(false); // Set loading state to false
      setLoadingProgress(100); // Set progress bar to 100% after loading is complete
      setTimeout(() => setLoadingProgress(0), 1000); // Reset progress bar after 1 second
    }
  };

  // Function to simulate loading progress
  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10; // Increment progress by 10%
      setLoadingProgress(progress); // Update loading progress state

      if (progress >= 100) {
        clearInterval(interval); // Clear interval when progress reaches 100%
      }
    }, 1000); // Interval duration in milliseconds (adjust as needed)
  };

  return (
    <div className='ai-image-generator'>
      <div className='header'>
        AI Image <span>Generator</span> {/* Header with gradient text */}
      </div>
      <div className='img-loading'>
        <div className='image'>
          <img
            src={imageUrl === '/' ? default_image : imageUrl} // Display generated image or default image
            alt='AI generated' // Alt text for image
          />
        </div>
        {/* Display loading bar and progress text when loading */}
        {loading && (
          <div className='loading-bar-container'>
            <div
              className='loading-bar'
              style={{ width: `${loadingProgress}%` }} // Width based on loading progress
            ></div>
            <div className='loading-text'>{loadingProgress}%</div>
          </div>
        )}
        
        {/* Display full loading text when loading */}
        <div className={loading ? 'loading-text-full' : 'display-none'}>
          Loading...
        </div>
      </div>
      {/* Search box for image description input */}
      <div className='search-box'>
        <input
          type='text'
          ref={inputRef} // Reference to input element
          className='search-name' // CSS class for input styling
          placeholder='Describe the image you want to see...' // Placeholder text
        />
        {/* Button to trigger image generation */}
        <div className='generate-btn' onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator; // Export ImageGenerator component
