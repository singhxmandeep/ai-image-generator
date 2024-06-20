import React, { useRef, useState } from 'react';
import "./ImageGenerator.css";
import default_image from "../Assets/AI-img.jpeg";

const ImageGenerator = () => {
    const [imageUrl, setImageUrl] = useState("/");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const imageGenerator = async () => {
        const inputValue = inputRef.current.value.trim();
        if (!inputValue) {
            alert("Please enter a prompt to generate an image.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "https://api.openai.com/v1/images/generations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    },
                    body: JSON.stringify({
                        prompt: inputValue,
                        n: 1,
                        size: "512x512"
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response from API:", errorData);
                throw new Error(`Failed to generate image: ${errorData.error.message}`);
            }

            const data = await response.json();
            setImageUrl(data.data[0].url);
        } catch (error) {
            console.error("Error generating image:", error);
            alert(`There was an error generating the image: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ai-image-generator'>
            <div className="header">AI Image <span>Generator</span></div>
            <div className="img-loading">
                <div className="image">
                    <img src={imageUrl === "/" ? default_image : imageUrl} alt='AI generated' />
                </div>
                <div className="loading">
                    <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
                </div>
                <div className={loading ? "loading-text-full" : "display-none"}>Loading...</div>
            </div>
            <div className="search-box">
                <input type="text" ref={inputRef} className="search-name" placeholder='Describe the image you want to see...' />
                <div className="generate-btn" onClick={imageGenerator}>Generate</div>
            </div>
        </div>
    );
};

export default ImageGenerator;
