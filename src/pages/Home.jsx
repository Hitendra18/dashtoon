import { useState } from "react";
import "./home.css";

export default function Home() {
  const [prompts, setPrompts] = useState(Array(10).fill(""));
  const [images, setImages] = useState(Array(10).fill(null));

  const query = async (data) => {
    const response = await fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: {
          Accept: "image/png",
          Authorization:
            "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return result;
  };

  const generateImages = async () => {
    try {
      const generatedImages = await Promise.all(
        prompts.map(async (prompt, index) => {
          const data = { inputs: prompt || "cat eating an ice cream" };
          const result = await query(data);
          return URL.createObjectURL(result);
        })
      );

      setImages(generatedImages);
    } catch (error) {
      console.error("Error generating images:", error);
    }
  };

  return (
    <div className="container">
      <div className="inputContainer">
        <div className="inputColumn">
          {prompts.slice(0, 5).map((prompt, index) => (
            <div key={index}>
              <label>
                Input {index + 1}:
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => {
                    const newPrompts = [...prompts];
                    newPrompts[index] = e.target.value;
                    setPrompts(newPrompts);
                  }}
                />
              </label>
            </div>
          ))}
        </div>
        <div className="inputColumn">
          {prompts.slice(5).map((prompt, index) => (
            <div key={index + 5}>
              <label>
                Input {index + 6}:
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => {
                    const newPrompts = [...prompts];
                    newPrompts[index + 5] = e.target.value;
                    setPrompts(newPrompts);
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <button className="button" onClick={generateImages}>
        Generate Images
      </button>

      <div className="pageContainer">
        {images.map((imageSrc, index) => (
          <div key={index}>
            {imageSrc && (
              <img src={imageSrc} alt={`Generated Image ${index + 1}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
