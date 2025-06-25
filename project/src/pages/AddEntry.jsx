import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import EmojiPicker from 'emoji-picker-react';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Palette, 
  Music, 
  Smile,
  Trash2,
  RefreshCw,
  Download
} from 'lucide-react';
import { saveEntry, getEntryById } from '../utils/storage';

const AddEntry = ({ theme }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [entry, setEntry] = useState({
    title: '',
    text: '',
    imageURL: '',
    mood: '😊',
    stickers: [],
    musicURL: '',
    doodleDataURL: ''
  });
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const sketchRef = useRef(null);
  const fileInputRef = useRef(null);
  const musicInputRef = useRef(null);
  const textareaRef = useRef(null);

  const stickers = ['💖', '✨', '🌟', '🦋', '🌸', '🌺', '🍀', '🌈', '☀️', '🌙', '⭐', '💫', '🎈', '🎀', '🎨', '📝', '💌', '📚', '🎵', '🎭'];

  useEffect(() => {
    if (isEditing) {
      const existingEntry = getEntryById(id);
      if (existingEntry) {
        setEntry(existingEntry);
        setImagePreview(existingEntry.imageURL);
      }
    }
  }, [id, isEditing]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [entry.text]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageURL = e.target.result;
        setEntry(prev => ({ ...prev, imageURL }));
        setImagePreview(imageURL);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEntry(prev => ({ ...prev, musicURL: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMoodSelect = (emojiObject) => {
    setEntry(prev => ({ ...prev, mood: emojiObject.emoji }));
    setShowEmojiPicker(false);
  };

  const addSticker = (sticker) => {
    setEntry(prev => ({
      ...prev,
      stickers: [...prev.stickers, sticker]
    }));
  };

  const removeSticker = (index) => {
    setEntry(prev => ({
      ...prev,
      stickers: prev.stickers.filter((_, i) => i !== index)
    }));
  };

  const saveDoodle = async () => {
    if (sketchRef.current) {
      try {
        const dataURL = await sketchRef.current.exportImage('png');
        setEntry(prev => ({ ...prev, doodleDataURL: dataURL }));
      } catch (error) {
        console.error('Error saving doodle:', error);
      }
    }
  };

  const clearDoodle = () => {
    if (sketchRef.current) {
      sketchRef.current.clearCanvas();
      setEntry(prev => ({ ...prev, doodleDataURL: '' }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveDoodle();
      
      const entryToSave = {
        ...entry,
        id: isEditing ? id : undefined,
        title: entry.title || 'Untitled Entry',
        createdAt: isEditing ? entry.createdAt : new Date().toISOString()
      };
      
      await saveEntry(entryToSave);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/journal');
      }, 2000);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen p-4"
    >
      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 font-indie"
        >
          ✨ Entry Saved Successfully!
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/journal">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                theme === 'light' 
                  ? 'bg-white text-lavender-600 shadow-md hover:bg-lavender-50' 
                  : 'bg-gray-800 text-purple-300 hover:bg-gray-700'
              }`}
            >
              <ArrowLeft size={20} />
              <span className="font-indie">Back to Journal</span>
            </motion.button>
          </Link>

          <h1 className={`font-handwriting text-3xl font-bold ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            {isEditing ? '✏️ Edit Entry' : '✨ New Memory'}
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg font-indie font-semibold ${
              saving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-lavender-500 to-blush-500 hover:from-lavender-600 hover:to-blush-600'
            } text-white`}
          >
            {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? 'Saving...' : 'Save Entry'}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Title Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-2xl shadow-lg ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
            >
              <label className={`block text-sm font-indie font-semibold mb-3 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                📝 Entry Title
              </label>
              <input
                type="text"
                value={entry.title}
                onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's on your mind today?"
                className={`w-full p-4 rounded-xl font-handwriting text-xl border-2 focus:outline-none focus:ring-4 transition-all ${
                  theme === 'light'
                    ? 'bg-lavender-50 border-lavender-200 focus:border-lavender-400 focus:ring-lavender-100 text-gray-800'
                    : 'bg-gray-700 border-gray-600 focus:border-purple-400 focus:ring-purple-900/20 text-white'
                }`}
              />
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-2xl shadow-lg ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
            >
              <label className={`block text-sm font-indie font-semibold mb-3 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                ✍️ Your Story
              </label>
              <textarea
                ref={textareaRef}
                value={entry.text}
                onChange={(e) => setEntry(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Pour your heart out..."
                className={`w-full p-4 rounded-xl font-handwriting text-lg border-2 focus:outline-none focus:ring-4 transition-all resize-none min-h-32 ${
                  theme === 'light'
                    ? 'bg-blush-50 border-blush-200 focus:border-blush-400 focus:ring-blush-100 text-gray-800'
                    : 'bg-gray-700 border-gray-600 focus:border-pink-400 focus:ring-pink-900/20 text-white'
                }`}
              />
            </motion.div>

            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-6 rounded-2xl shadow-lg ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
            >
              <label className={`block text-sm font-indie font-semibold mb-3 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                📸 Add Photo
              </label>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full p-4 border-2 border-dashed rounded-xl transition-all ${
                    theme === 'light'
                      ? 'border-mint-300 hover:border-mint-400 hover:bg-mint-50'
                      : 'border-green-600 hover:border-green-500 hover:bg-green-900/20'
                  }`}
                >
                  <ImageIcon className="mx-auto mb-2 text-mint-500" size={32} />
                  <p className={`font-indie ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Click to upload an image
                  </p>
                </motion.button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl shadow-md"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEntry(prev => ({ ...prev, imageURL: '' }));
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Music Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-6 rounded-2xl shadow-lg ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
            >
              <label className={`block text-sm font-indie font-semibold mb-3 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                🎵 Background Music
              </label>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => musicInputRef.current?.click()}
                className={`w-full p-4 border-2 border-dashed rounded-xl transition-all ${
                  theme === 'light'
                    ? 'border-purple-300 hover:border-purple-400 hover:bg-purple-50'
                    : 'border-purple-600 hover:border-purple-500 hover:bg-purple-900/20'
                }`}
              >
                <Music className="mx-auto mb-2 text-purple-500" size={32} />
                <p className={`font-indie ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {entry.musicURL ? 'Music uploaded ✨' : 'Upload background music'}
                </p>
              </motion.button>
              
              <input
                ref={musicInputRef}
                type="file"
                accept="audio/*"
                onChange={handleMusicUpload}
                className="hidden"
              />

              {entry.musicURL && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <audio controls className="w-full">
                    <source src={entry.musicURL} />
                  </audio>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Interactive Elements */}
          <div className="space-y-6">
            {/* Mood Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-6 rounded-2xl shadow-lg ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
            >
              <label className={`block text-sm font-indie font-semibold mb-3 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                😊 How are you feeling?
              </label>
              
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`flex items-center gap-3 w-full p-4 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-yellow-300 bg-yellow-50 hover:border-yellow-400'
                      : 'border-yellow-600 bg-yellow-900/20 hover:border-yellow-500'
                  }`}
                >
                  <span className="text-3xl">{entry.mood}</span>
                  <span className={`font-indie flex-1 text-left ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Click to change mood
                  </span>
                  <Smile size={20} className="text-yellow-500" />
                </motion.button>

                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50"
                  >
                    <EmojiPicker
                      onEmojiClick={handleMoodSelect}
                      theme={theme === 'light' ? 'light' : 'dark'}
                      width="100%"
                      height={400}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Stickers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`p-6 rounded-2xl shadow-lg ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
            >
              <label className={`block text-sm font-indie font-semibold mb-3 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                ✨ Stickers
              </label>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {stickers.map((sticker, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addSticker(sticker)}
                    className={`p-3 text-2xl rounded-xl transition-all ${
                      theme === 'light'
                        ? 'hover:bg-pink-100'
                        : 'hover:bg-pink-900/20'
                    }`}
                  >
                    {sticker}
                  </motion.button>
                ))}
              </div>

              {entry.stickers.length > 0 && (
                <div className={`p-3 rounded-xl ${
                  theme === 'light' ? 'bg-pink-50' : 'bg-pink-900/20'
                }`}>
                  <p className={`text-xs font-indie mb-2 ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Selected stickers:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entry.stickers.map((sticker, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeSticker(index)}
                        className="relative text-xl"
                      >
                        {sticker}
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          ×
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Doodle Canvas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`p-6 rounded-2xl shadow-lg ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <label className={`text-sm font-indie font-semibold ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  🎨 Doodle Space
                </label>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveDoodle}
                    className="px-3 py-1 text-xs bg-green-500 text-white rounded-full font-indie"
                  >
                    <Download size={12} className="inline mr-1" />
                    Save
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearDoodle}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-full font-indie"
                  >
                    <Trash2 size={12} className="inline mr-1" />
                    Clear
                  </motion.button>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden">
                <ReactSketchCanvas
                  ref={sketchRef}
                  width="100%"
                  height="200px"
                  strokeWidth={3}
                  strokeColor="#8b5cf6"
                  canvasColor={theme === 'light' ? '#ffffff' : '#374151'}
                  style={{
                    borderRadius: '8px',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddEntry;