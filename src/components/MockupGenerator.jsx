import React, { useState, useRef } from 'react';
import { Download, Image, Upload, X, CheckCircle, Clock, AlertCircle, KeyRound, Check, CircleSlash } from 'lucide-react';

const MockupGenerator = () => {
  const [selectedMockups, setSelectedMockups] = useState(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState(new Map());
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [currentlyGenerating, setCurrentlyGenerating] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const fileInputRef = useRef(null);

  // Access the Replicate API Token from the environment variables
  const replicateApiToken = import.meta.env.VITE_REPLICATE_API_TOKEN;

  // Poll a prediction until it completes
  const pollPrediction = async (predictionId, maxAttempts = 30, delay = 2000) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: {
            'Authorization': `Bearer ${replicateApiToken}`,
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to get prediction status: ${response.statusText}`);
        }

        const prediction = await response.json();
        console.log(`Polling attempt ${attempt + 1}: ${prediction.status}`);

        if (prediction.status === 'succeeded' || prediction.status === 'failed' || prediction.status === 'canceled') {
          return prediction;
        }

        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`Polling attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Prediction polling timeout');
  };

  const mockupTypes = [
    {
      id: 1,
      name: "Main Listing Image",
      ratio: "1:1",
      size: "2700×2700px",
      description: "Samsung Frame TV hero shot",
      prompt: "A realistic modern living room interior with the uploaded artwork displayed on a large Samsung Frame TV mounted on a clean white wall, soft natural daylight from windows, neutral boho decor, beige sofa partially visible, warm lighting, professional interior photography style, high resolution, the artwork clearly visible and well-lit on the TV screen, no people, clean minimalist aesthetic"
    },
    {
      id: 2,
      name: "Alt Closeup Detail",
      ratio: "5:4",
      size: "1500×1200px", 
      description: "Artwork detail focus",
      prompt: "Close-up detail view of the uploaded artwork as a high-quality framed print on a wall, soft warm lighting highlighting the textures and colors, professional gallery lighting, detailed focus on artistic elements, warm color grading, the artwork as the main focus, museum quality presentation"
    },
    {
      id: 3,
      name: "Lifestyle Mockup",
      ratio: "3:2",
      size: "Wide interior",
      description: "Boho-Scandi living room",
      prompt: "The uploaded artwork as a large framed print above a beige linen sofa in a cozy Scandinavian living room, natural wood coffee table, woven baskets, dried pampas grass, warm throw pillows, soft afternoon sunlight through sheer curtains, lived-in but curated aesthetic, wide interior shot, artwork prominently featured and well-integrated, warm natural lighting"
    },
    {
      id: 4,
      name: "Secondary Angle",
      ratio: "5:4",
      size: "Alternative view",
      description: "Different frame style",
      prompt: "Show the uploaded artwork in a natural wood frame displayed on a warm taupe accent wall, captured from a different angle than the main shot. Use minimalist styling with soft side lighting and clean modern interior design elements. Create an editorial photography style with 5:4 crop, ensuring the artwork is clearly visible and beautifully presented."
    },
    {
      id: 5,
      name: "Digital Download Notice",
      ratio: "4:5",
      size: "Informational",
      description: "Product format explanation",
      prompt: "Create a clean informational graphic with soft cream background and modern typography. Include a download icon and text overlay reading 'This is a DIGITAL FILE - No physical item will be shipped'. Include a small preview of the uploaded artwork in the design. Use minimalist design with warm taupe accents in 4:5 vertical format, styled professionally for Etsy listings."
    },
    {
      id: 6,
      name: "What's Included",
      ratio: "4:5",
      size: "File list visual",
      description: "Contents graphic",
      prompt: "Design an elegant infographic layout on cream background with 'What's Included' header. Show visual icons for Frame-TV PNG file, 2x JPG print files, and PDF guide, along with a preview of the uploaded artwork. Use soft sand-colored design elements in a clean modern layout, 4:5 vertical format, suitable for Etsy product listings."
    },
    {
      id: 7,
      name: "How to Use Instructions",
      ratio: "4:5",
      size: "3-step process",
      description: "Usage guide",
      prompt: "Create a modern step-by-step visual guide with cream background and 'How to Use' title. Show three numbered steps: 1) Download ZIP folder, 2) Transfer PNG to Samsung Frame, 3) Print JPGs at home/lab. Include a preview of the uploaded artwork and use clean typography with taupe accent colors in 4:5 format."
    },
    {
      id: 8,
      name: "Etsy Download Guide",
      ratio: "4:5", 
      size: "Platform-specific",
      description: "Download instructions",
      prompt: "Design a minimalist instruction graphic with 'How to Download' header and Etsy-style button mockups. Include text: 'Go to Purchases → Click Download' with soft cream background and modern sans-serif font. Add subtle Etsy green accents and a thumbnail of the uploaded artwork in clean vertical layout."
    },
    {
      id: 9,
      name: "Collection Grid",
      ratio: "1:1",
      size: "Multi-artwork",
      description: "Portfolio preview",
      prompt: "Create an elegant collection grid layout showing the uploaded artwork as the featured piece alongside 2-3 complementary placeholder artworks that match the style and color palette. Use consistent frames, clean white background, equal spacing, and professional product photography style in square format."
    },
    {
      id: 10,
      name: "Brand Identity",
      ratio: "1:1",
      size: "Testimonial highlight",
      description: "Aurelia Galleria branding",
      prompt: "Design with soft gradient background in cream and warm taupe colors, subtle 'Aurelia Galleria' watermark in elegant serif font, 5-star rating graphic, and testimonial quote: 'Beautiful quality, perfect for our Frame TV!'. Include a preview of the uploaded artwork with minimalist luxury aesthetic in square format."
    }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setGenerationError('Image size must be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result.split(',')[1];
        setUploadedImage(base64Data);
        setUploadedImagePreview(e.target.result);
        setGenerationError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setUploadedImagePreview(null);
    setGeneratedImages(new Map());
    setGenerationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleMockup = (id) => {
    const newSelected = new Set(selectedMockups);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMockups(newSelected);
  };

  const generateSingleMockup = async (mockup) => {
    setCurrentlyGenerating(mockup.id);
    
    try {
      // 🚀 REAL REPLICATE API INTEGRATION
      if (replicateApiToken && uploadedImage) {
        console.log(`Generating real mockup for "${mockup.name}" using FLUX Pro...`);
        
        // Create the data URL for the uploaded image
        const imageDataURL = `data:image/jpeg;base64,${uploadedImage}`;
        
        // Create prediction using Replicate API with FLUX Pro
        const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-pro/predictions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${replicateApiToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'wait'  // Wait up to 60 seconds for completion
          },
          body: JSON.stringify({
            input: {
              image: imageDataURL,
              prompt: mockup.prompt,
              width: mockup.ratio === "1:1" ? 1024 : mockup.ratio === "5:4" ? 1280 : mockup.ratio === "4:5" ? 1024 : 1536,
              height: mockup.ratio === "1:1" ? 1024 : mockup.ratio === "5:4" ? 1024 : mockup.ratio === "4:5" ? 1280 : 1024,
              prompt_strength: 0.8,  // How much to follow the prompt vs the input image
              safety_tolerance: 2,   // Safety filter tolerance (1-5, higher is more permissive)
              seed: Math.floor(Math.random() * 1000000) // Random seed for variety
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Replicate API error: ${errorData.detail || response.statusText}`);
        }

        const prediction = await response.json();
        console.log('Prediction response:', prediction);

        // Handle different prediction states
        if (prediction.status === 'succeeded') {
          // Prediction completed immediately
          const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
          if (imageUrl) {
            return { id: mockup.id, imageData: imageUrl, success: true };
          }
        } else if (prediction.status === 'starting' || prediction.status === 'processing') {
          // Need to poll for completion
          const finalPrediction = await pollPrediction(prediction.id);
          const imageUrl = Array.isArray(finalPrediction.output) ? finalPrediction.output[0] : finalPrediction.output;
          if (imageUrl && finalPrediction.status === 'succeeded') {
            return { id: mockup.id, imageData: imageUrl, success: true };
          } else {
            throw new Error(finalPrediction.error || 'Prediction failed');
          }
        } else if (prediction.status === 'failed') {
          throw new Error(prediction.error || 'Prediction failed');
        }
        
        throw new Error('Unexpected prediction response');
      }
      
      // Simulate generation time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 400;
      canvas.height = 300;
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#F7F5F0');
      gradient.addColorStop(0.5, '#E6DDD4');
      gradient.addColorStop(1, '#D4C4B0');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < canvas.width; i += 20) {
        for (let j = 0; j < canvas.height; j += 20) {
          ctx.fillStyle = '#8B7355';
          ctx.fillRect(i, j, 1, 1);
        }
      }
      ctx.globalAlpha = 1;
      
      ctx.fillStyle = '#8B7355';
      ctx.font = 'bold 18px serif';
      ctx.textAlign = 'center';
      ctx.fillText(replicateApiToken ? '✨ FLUX PRO ✨' : '✨ DEMO MOCKUP ✨', canvas.width/2, canvas.height/2 - 30);
      ctx.font = '16px serif';
      ctx.fillText(mockup.name, canvas.width/2, canvas.height/2);
      ctx.font = '14px sans-serif';
      ctx.fillText(`${mockup.ratio} • ${mockup.size}`, canvas.width/2, canvas.height/2 + 20);
      
      ctx.font = '12px serif';
      ctx.fillStyle = '#A0845C';
      ctx.fillText('Aurelia Galleria', canvas.width/2, canvas.height/2 + 40);
      
      if (uploadedImagePreview) {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          // draw rounded preview rectangle manually for broader browser support
          const x = canvas.width - 95;
          const y = 10;
          const width = 85;
          const height = 65;
          const radius = 5;

          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.arcTo(x + width, y, x + width, y + radius, radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
          ctx.lineTo(x + radius, y + height);
          ctx.arcTo(x, y + height, x, y + height - radius, radius);
          ctx.lineTo(x, y + radius);
          ctx.arcTo(x, y, x + radius, y, radius);
          ctx.closePath();

          ctx.clip();
          ctx.drawImage(img, x, y, width, height);
          ctx.restore();
        };
        img.src = uploadedImagePreview;
      }
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      return { id: mockup.id, imageData, success: true };
      
    } catch (error) {
      console.error('Error generating mockup:', error);
      
      let errorMessage = 'Failed to generate mockup';
      
      if (error.message.includes('Replicate API error')) {
        errorMessage = 'Replicate API error: ' + error.message;
      } else if (error.message.includes('network') || error.name === 'TypeError') {
        errorMessage = 'Network error - please check your connection';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out - please try again';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'API rate limit exceeded - please wait and try again';
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        errorMessage = 'API quota exceeded - please check your Replicate account';
      } else {
        errorMessage = error.message;
      }
      
      return { id: mockup.id, imageData: null, error: errorMessage, success: false };
    }
  };

  const generateMockups = async () => {
    if (!uploadedImage) {
      setGenerationError('Please upload an artwork image first!');
      return;
    }

    setIsGenerating(true);
    setGeneratedImages(new Map());
    setGenerationError(null);
    
    const selectedMockupData = mockupTypes.filter(mockup => selectedMockups.has(mockup.id));
    let successCount = 0;
    let errorCount = 0;
    
    for (const mockup of selectedMockupData) {
      const result = await generateSingleMockup(mockup);
      if (result.success && result.imageData) {
        setGeneratedImages(prev => new Map(prev).set(result.id, result.imageData));
        successCount++;
      } else {
        console.error(`Failed to generate mockup "${mockup.name}":`, result.error);
        errorCount++;
      }
    }
    
    setCurrentlyGenerating(null);
    setIsGenerating(false);
    
    if (errorCount > 0) {
      setGenerationError(`Generated ${successCount} mockups successfully. ${errorCount} failed to generate.`);
    }
  };

  const downloadImage = (id, name) => {
    const imageData = generatedImages.get(id);
    if (imageData) {
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `AG_Mockup_${name.replace(/\s+/g, '_')}_${timestamp}.jpg`;
      link.href = imageData;
      link.click();
    }
  };

  const downloadAll = () => {
    generatedImages.forEach((imageData, id) => {
      const mockup = mockupTypes.find(m => m.id === id);
      if (mockup) {
        setTimeout(() => downloadImage(id, mockup.name), (id - 1) * 200);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-amber-900">Aurelia Galleria</h1>
              <p className="text-amber-700 text-sm">AI-Powered Mockup Generator</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Image className="w-4 h-4" />
              <span>Upload • Generate • Download</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-8">
          <h2 className="text-xl font-serif text-amber-900 mb-4">Upload Your Artwork</h2>
          
          {!uploadedImagePreview ? (
            <div className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Upload className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-amber-700 mb-2">Upload your artwork to generate mockups</p>
              <p className="text-sm text-amber-600 mb-4">Supports JPG, PNG, WebP formats (max 10MB)</p>
              <button onClick={() => fileInputRef.current?.click()} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200">
                Choose Image
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg">
              <div className="relative">
                <img src={uploadedImagePreview} alt="Uploaded artwork" className="w-24 h-24 object-cover rounded-lg shadow-md" />
                <button onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-1">Artwork Uploaded Successfully!</h3>
                <p className="text-sm text-amber-600 mb-2">Ready to generate mockups with your artwork</p>
                <button onClick={() => fileInputRef.current?.click()} className="text-sm text-amber-600 hover:text-amber-700 underline">
                  Upload different image
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif text-amber-900">Generate Mockups</h2>
            <div className="text-sm text-amber-600">
              {selectedMockups.size} of {mockupTypes.length} selected
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <button onClick={generateMockups} disabled={isGenerating || selectedMockups.size === 0 || !uploadedImage} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 disabled:cursor-not-allowed">
              {isGenerating ? (<><Clock className="w-5 h-5 animate-spin" />Generating Mockups...</>) : (<><Image className="w-5 h-5" />Generate Selected Mockups</>)}
            </button>
            
            {generatedImages.size > 0 && (
              <button onClick={downloadAll} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200">
                <Download className="w-5 h-5" />
                Download All ({generatedImages.size})
              </button>
            )}
          </div>
          
          {/* API Key Status Check */}
          <div className={`flex items-center gap-2 text-sm p-4 rounded-lg mb-4 ${replicateApiToken ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {replicateApiToken ? <Check className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
            <p><strong>Replicate API Key:</strong> {replicateApiToken ? 'Detected - Using FLUX Pro for generation' : 'Not set - Using demo generation'}</p>
          </div>
          
          {!uploadedImage && (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-4 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <p>Please upload your artwork first to generate mockups</p>
            </div>
          )}

          {generationError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4" />
              <p>{generationError}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockupTypes.map((mockup) => (
            <div key={mockup.id} className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
              <div className="p-4 border-b border-orange-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">{mockup.name}</h3>
                    <div className="text-sm text-amber-600">{mockup.ratio} • {mockup.size}</div>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={selectedMockups.has(mockup.id)} onChange={() => toggleMockup(mockup.id)} className="sr-only" />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${selectedMockups.has(mockup.id) ? 'bg-amber-500 border-amber-500 text-white' : 'border-amber-300 hover:border-amber-400'}`}>
                      {selectedMockups.has(mockup.id) && <CheckCircle className="w-3 h-3" />}
                    </div>
                  </label>
                </div>
                <p className="text-sm text-amber-700">{mockup.description}</p>
              </div>

              <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center relative">
                {generatedImages.has(mockup.id) ? (
                  <div className="w-full h-full relative">
                    <img src={generatedImages.get(mockup.id)} alt={mockup.name} className="w-full h-full object-cover" />
                    <button onClick={() => downloadImage(mockup.id, mockup.name)} className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200" title="Download mockup">
                      <Download className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>
                ) : currentlyGenerating === mockup.id ? (
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-amber-600">Generating...</p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Image className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-sm text-amber-600">{uploadedImage ? 'Ready to generate' : 'Upload artwork first'}</p>

                  </div>
                )}
              </div>

              <div className="p-4 bg-orange-50">
                <details className="text-sm">
                  <summary className="cursor-pointer text-amber-700 font-medium mb-2">View AI Prompt</summary>
                  <p className="text-amber-600 text-xs leading-relaxed">{mockup.prompt}</p>
                </details>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockupGenerator;