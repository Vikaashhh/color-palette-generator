import React, { useState, useEffect } from 'react';
import { Copy, RotateCcw, Save, Trash, PlusCircle, Heart, EyeOff } from 'lucide-react';

const ColorPaletteGenerator = () => {
  const [colors, setColors] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [copied, setCopied] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Generate random color in hex format
  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  };

  // Generate a new palette with 5 colors
  const generatePalette = () => {
    const newColors = [];
    for (let i = 0; i < 5; i++) {
      newColors.push(generateRandomColor());
    }
    setColors(newColors);
  };

  // Add a new color to the palette
  const addColor = () => {
    if (colors.length < 8) {
      setColors([...colors, generateRandomColor()]);
    }
  };

  // Remove a color from the palette
  const removeColor = (index) => {
    if (colors.length > 1) {
      const newColors = [...colors];
      newColors.splice(index, 1);
      setColors(newColors);
    }
  };

  // Save the current palette
  const savePalette = () => {
    setSavedPalettes([...savedPalettes, [...colors]]);
  };

  // Copy color to clipboard
  const copyToClipboard = (color, index) => {
    navigator.clipboard.writeText(color);
    setCopied(index);
    setTimeout(() => setCopied(null), 1000);
  };

  // Calculate contrasting text color (black or white) based on background
  const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? 'text-gray-800' : 'text-white';
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Generate initial palette on component mount
  useEffect(() => {
    generatePalette();
  }, []);

  return (
    <div className={`flex items-center justify-center min-h-screen w-full ${darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
      <div className={`w-full max-w-4xl mx-auto my-8 p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white/90 backdrop-blur-sm'} rounded-xl shadow-xl transition-all duration-300`}>
        {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-indigo-900'} mb-2`}>Palette Studio</h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-indigo-600'}`}>Design with color harmony</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'} transition-colors duration-200`}
          >
            <EyeOff size={18} />
          </button>
        </div>
        
        {/* Color Palette Display */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {colors.map((color, index) => (
              <div 
                key={index} 
                className="relative w-36 h-40 rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:scale-105 group"
                style={{ backgroundColor: color }}
              >
                <div className={`absolute inset-0 p-4 flex flex-col justify-between ${getContrastColor(color)}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-bold">{color.toUpperCase()}</span>
                    <button 
                      onClick={() => copyToClipboard(color, index)}
                      className="p-1.5 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => removeColor(index)}
                      className="p-1.5 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  {copied === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm text-white font-medium">
                      Copied!
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {colors.length < 8 && (
              <button 
                onClick={addColor}
                className={`w-36 h-40 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors duration-200 ${
                  darkMode 
                    ? 'border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-500' 
                    : 'border-indigo-200 text-indigo-300 hover:text-indigo-500 hover:border-indigo-400'
                }`}
              >
                <PlusCircle size={24} />
              </button>
            )}
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={generatePalette}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors duration-200 ${
              darkMode 
                ? 'bg-violet-700 hover:bg-violet-600 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <RotateCcw size={18} />
            Generate New
          </button>
          <button 
            onClick={savePalette}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                : 'bg-white hover:bg-indigo-100 text-indigo-700 shadow-sm'
            }`}
          >
            <Heart size={18} />
            Save Palette
          </button>
        </div>
        
        {/* Saved Palettes */}
        {savedPalettes.length > 0 && (
          <div className="mt-10">
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-indigo-900'} text-center`}>Your Saved Palettes</h2>
            <div className="space-y-4">
              {savedPalettes.map((palette, paletteIndex) => (
                <div 
                  key={paletteIndex} 
                  className={`p-4 rounded-lg transition-all duration-200 hover:shadow-md ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="flex h-16 rounded-lg overflow-hidden">
                    {palette.map((color, colorIndex) => (
                      <div 
                        key={colorIndex}
                        className="flex-grow transition-transform duration-200 hover:transform hover:scale-y-105 cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => copyToClipboard(color, `saved-${paletteIndex}-${colorIndex}`)}
                      ></div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => {
                        setColors([...palette]);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`text-sm font-medium px-3 py-1 rounded ${
                        darkMode 
                          ? 'text-violet-400 hover:text-violet-300' 
                          : 'text-indigo-600 hover:text-indigo-800'
                      }`}
                    >
                      Load palette
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPaletteGenerator;