import React, { useRef, useState } from "react";
import default_image from "../Assets/AI-image.png"; // Import default image asset
import { motion } from "framer-motion"; // Import framer-motion for animations
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState("/"); // State to hold generated image URL
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [loadingProgress, setLoadingProgress] = useState(0); // State to manage loading progress
  const inputRef = useRef(null); // Reference to input element for image description
  const [darkMode, setDarkMode] = useState(true); // State to manage theme

  // Function to toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Function to handle image generation
  const imageGenerator = async () => {
    const inputValue = inputRef.current.value.trim(); // Get input value and trim whitespace
    if (!inputValue) {
      alert("Please enter a prompt to generate an image."); // Alert if input is empty
      return;
    }

    setLoading(true); // Set loading state to true
    setLoadingProgress(0); // Reset progress bar to 0%

    // Simulate loading progress
    simulateProgress();

    try {
      // Call OpenAI API to generate image
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // API authorization header
          },
          body: JSON.stringify({
            prompt: inputValue,
            n: 1,
            size: "512x512",
          }),
        }
      );

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        throw new Error(`Failed to generate image: ${errorData.error.message}`);
      }

      // Parse response data and set image URL
      const data = await response.json();
      console.log("API Response Data:", data); // Log the API response data
      const newImageUrl = data.data[0].url;
      console.log("New Image URL:", newImageUrl); // Log the new image URL
      setImageUrl(newImageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
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

  // Function to handle image download
  const downloadImage = () => {
    const extension = imageUrl.split(".").pop().toLowerCase(); // Get image extension
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ai-generated-image.${
      extension === "png" || extension === "jpg" ? extension : "png"
    }`; // Set download attribute
    link.target = "_blank"; // Open in new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to copy image URL to clipboard
  const copyImageUrl = () => {
    navigator.clipboard
      .writeText(imageUrl)
      .then(() => {
        alert("Image URL copied to clipboard!"); // Alert on success
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        alert(`Failed to copy image URL: ${error.message}`); // Alert on failure
      });
  };

  return (
    <div
      className={`flex flex-col items-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen py-8 px-4 md:px-12 lg:px-24 relative`}
    >
      <button
        className="absolute top-4 right-4 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-white-700"
        onClick={toggleTheme}
      >
        <FontAwesomeIcon
          icon={darkMode ? faSun : faMoon}
          style={{ color: darkMode ? "white" : "black" }}
        />
      </button>

      <div className="text-5xl md:text-6xl font-bold mb-8 text-yellow-400 text-center">
        AI Image{" "}
        <span className="bg-gradient-to-r from-yellow-500 to-purple-500 bg-clip-text text-transparent">
          Generator
        </span>
      </div>
      <div className="flex flex-col items-center mb-8 w-full max-w-2xl">
        <div className="w-full h-64 md:h-96 bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden shadow-lg">
          <motion.img
            src={imageUrl === "/" ? default_image : imageUrl} // Display generated image or default image
            alt="AI generated" // Alt text for image
            className="object-contain w-full h-full" // Ensure the whole image is shown
            initial={{ opacity: 0, scale: 0.9 }} // Initial animation state
            animate={{ opacity: 1, scale: 1 }} // Animate to final state
            transition={{ duration: 0.5 }} // Animation duration
          />
        </div>
        <div className="w-full mt-4 relative">
          <div
            className="w-full h-2 bg-gray-500 rounded-full relative"
            style={{ visibility: loading ? "visible" : "hidden" }} // Show progress bar if loading
          >
            <div
              className="h-full bg-red-500 transition-all duration-500 ease-in-out absolute top-0 left-0"
              style={{ width: `${loadingProgress}%` }} // Width based on loading progress
            ></div>
          </div>
          <div
            className={
              loading
                ? "absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-sm"
                : "hidden"
            }
          >
            {loadingProgress}%
          </div>
        </div>
        <div className={loading ? "mt-4 text-blue-500" : "hidden"}>
          Loading...
        </div>
      </div>
      <div className="flex items-center flex-col md:flex-row bg-gray-800 p-4 rounded-full mt-4 gap-4 w-full max-w-2xl">
        <input
          type="text"
          ref={inputRef} // Reference to input element
          className="flex-grow h-12 px-4 rounded-l-full bg-gray-800 text-gray-400 outline-none mb-2 md:mb-0"
          placeholder="Describe the image you want to see..." // Placeholder text
        />
        <button
          className="bg-gradient-to-r from-yellow-500 to-purple-500 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out hover:border-white"
          onClick={imageGenerator} // Generate image on click
        >
          Generate
        </button>
      </div>
      <div className="flex mt-4">
        {imageUrl !== "/" && (
          <button
            className="bg-gradient-to-r from-yellow-500 to-purple-500 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out hover:border-white"
            onClick={downloadImage} // Download image on click
          >
            Download Image
          </button>
        )}
        {imageUrl !== "/" && (
          <button
            className="bg-gradient-to-r from-yellow-500 to-purple-500 text-white font-bold mx-4 py-2 px-6 rounded-full transition duration-300 ease-in-out hover:border-white"
            onClick={copyImageUrl} // Copy image URL on click
          >
            Copy Image URL
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
