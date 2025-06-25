import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Calendar,
  Heart,
  Download,
  Upload,
  BarChart3,
  Eye,
  X
} from 'lucide-react';
import { getEntries, deleteEntry, exportToJSON, importFromJSON } from '../utils/storage';

const Dashboard = ({ theme }) => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const moods = ['😊', '😢', '😍', '😴', '🤔', '😤', '🎉', '😌', '🥰', '😎'];

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterAndSortEntries();
  }, [entries, searchTerm, moodFilter, sortBy]);

  const loadEntries = () => {
    const loadedEntries = getEntries();
    setEntries(loadedEntries);
  };

  const filterAndSortEntries = () => {
    let filtered = [...entries];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by mood
    if (moodFilter !== 'all') {
      filtered = filtered.filter(entry => entry.mood === moodFilter);
    }

    // Sort entries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredEntries(filtered);
  };

  const handleDelete = async (id) => {
    const success = deleteEntry(id);
    if (success) {
      loadEntries();
      setShowDeleteModal(null);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importFromJSON(file)
        .then(() => {
          loadEntries();
          alert('Entries imported successfully!');
        })
        .catch((error) => {
          alert('Error importing entries: ' + error);
        });
    }
  };

  const getStats = () => {
    const totalEntries = entries.length;
    const moodCounts = {};
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    const mostUsedMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, ''
    );
    
    const entriesThisMonth = entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && 
             entryDate.getFullYear() === now.getFullYear();
    }).length;

    return { totalEntries, mostUsedMood, entriesThisMonth, moodCounts };
  };

  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  theme === 'light' 
                    ? 'bg-white text-lavender-600 shadow-md hover:bg-lavender-50' 
                    : 'bg-gray-800 text-purple-300 hover:bg-gray-700'
                }`}
              >
                <Home size={20} />
                <span className="font-indie">Home</span>
              </motion.button>
            </Link>

            <h1 className={`font-handwriting text-4xl font-bold ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              📚 My Journal Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(!showStats)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                theme === 'light' 
                  ? 'bg-mint-500 text-white hover:bg-mint-600' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <BarChart3 size={16} />
              <span className="font-indie text-sm">Stats</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToJSON}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                theme === 'light' 
                  ? 'bg-blush-500 text-white hover:bg-blush-600' 
                  : 'bg-pink-600 text-white hover:bg-pink-700'
              }`}
            >
              <Download size={16} />
              <span className="font-indie text-sm">Export</span>
            </motion.button>

            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer ${
                theme === 'light' 
                  ? 'bg-lavender-500 text-white hover:bg-lavender-600' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <Upload size={16} />
              <span className="font-indie text-sm">Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </motion.label>
          </div>
        </div>

        {/* Statistics Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-6 rounded-2xl shadow-lg mb-8 ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
            >
              <h2 className={`font-handwriting text-2xl font-bold mb-4 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                📊 Your Journal Statistics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    theme === 'light' ? 'text-lavender-600' : 'text-purple-400'
                  }`}>
                    {stats.totalEntries}
                  </div>
                  <div className={`text-sm font-indie ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Total Entries
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {stats.mostUsedMood}
                  </div>
                  <div className={`text-sm font-indie ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Favorite Mood
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    theme === 'light' ? 'text-mint-600' : 'text-green-400'
                  }`}>
                    {stats.entriesThisMonth}
                  </div>
                  <div className={`text-sm font-indie ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    This Month
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    theme === 'light' ? 'text-blush-600' : 'text-pink-400'
                  }`}>
                    {entries.length > 0 ? Math.round(entries.reduce((acc, entry) => 
                      acc + entry.text.length, 0) / entries.length) : 0}
                  </div>
                  <div className={`text-sm font-indie ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Avg. Words
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter Bar */}
        <div className={`p-6 rounded-2xl shadow-lg mb-8 ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        }`}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all font-indie ${
                  theme === 'light'
                    ? 'bg-gray-50 border-gray-200 focus:border-lavender-400 focus:ring-lavender-100 text-gray-800'
                    : 'bg-gray-700 border-gray-600 focus:border-purple-400 focus:ring-purple-900/20 text-white'
                }`}
              />
            </div>

            {/* Mood Filter */}
            <div className="relative">
              <select
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all font-indie appearance-none cursor-pointer ${
                  theme === 'light'
                    ? 'bg-gray-50 border-gray-200 focus:border-blush-400 focus:ring-blush-100 text-gray-800'
                    : 'bg-gray-700 border-gray-600 focus:border-pink-400 focus:ring-pink-900/20 text-white'
                }`}
              >
                <option value="all">All Moods</option>
                {moods.map(mood => (
                  <option key={mood} value={mood}>{mood} Mood</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all font-indie appearance-none cursor-pointer ${
                  theme === 'light'
                    ? 'bg-gray-50 border-gray-200 focus:border-mint-400 focus:ring-mint-100 text-gray-800'
                    : 'bg-gray-700 border-gray-600 focus:border-green-400 focus:ring-green-900/20 text-white'
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">A-Z Title</option>
              </select>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Entries Grid */}
        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  theme === 'light' ? 'bg-white hover:bg-gray-50' : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedEntry(entry)}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-3xl">{entry.mood}</div>
                  <div className={`text-xs font-indie ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Image Preview */}
                {entry.imageURL && (
                  <div className="mb-4">
                    <img 
                      src={entry.imageURL} 
                      alt="Entry preview" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className={`font-handwriting text-xl font-bold mb-2 line-clamp-2 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  {entry.title}
                </h3>

                {/* Text Preview */}
                <p className={`font-indie text-sm line-clamp-3 mb-4 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  {entry.text}
                </p>

                {/* Stickers */}
                {entry.stickers && entry.stickers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {entry.stickers.slice(0, 5).map((sticker, idx) => (
                      <span key={idx} className="text-lg">{sticker}</span>
                    ))}
                    {entry.stickers.length > 5 && (
                      <span className={`text-xs ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        +{entry.stickers.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEntry(entry);
                    }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-indie ${
                      theme === 'light' 
                        ? 'bg-lavender-100 text-lavender-700 hover:bg-lavender-200' 
                        : 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
                    }`}
                  >
                    <Eye size={12} />
                    View
                  </motion.button>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-entry/${entry.id}`);
                      }}
                      className={`p-2 rounded-full ${
                        theme === 'light' 
                          ? 'bg-mint-100 text-mint-700 hover:bg-mint-200' 
                          : 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
                      }`}
                    >
                      <Edit3 size={14} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteModal(entry.id);
                      }}
                      className={`p-2 rounded-full ${
                        theme === 'light' 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-red-900/30 text-red-300 hover:bg-red-900/50'
                      }`}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-16 ${
              theme === 'light' ? 'bg-white' : 'bg-gray-800'
            } rounded-2xl shadow-lg`}
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className={`font-handwriting text-2xl font-bold mb-2 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              {entries.length === 0 ? 'No entries yet!' : 'No entries match your filters'}
            </h3>
            <p className={`font-indie text-lg mb-6 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {entries.length === 0 
                ? 'Start your journaling journey today!'
                : 'Try adjusting your search or filters'
              }
            </p>
            {entries.length === 0 && (
              <Link to="/add-entry">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-lavender-500 to-blush-500 text-white rounded-full font-handwriting text-xl shadow-lg"
                >
                  ✨ Create Your First Entry
                </motion.button>
              </Link>
            )}
          </motion.div>
        )}

        {/* Entry Preview Modal */}
        <AnimatePresence>
          {selectedEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedEntry(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 rounded-2xl shadow-2xl ${
                  theme === 'light' ? 'bg-white' : 'bg-gray-800'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedEntry.mood}</span>
                    <div className={`text-sm font-indie ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {new Date(selectedEntry.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedEntry(null)}
                    className={`p-2 rounded-full ${
                      theme === 'light' 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <h2 className={`font-handwriting text-3xl font-bold mb-4 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  {selectedEntry.title}
                </h2>

                {selectedEntry.imageURL && (
                  <img 
                    src={selectedEntry.imageURL} 
                    alt="Entry image" 
                    className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
                  />
                )}

                <div className={`font-handwriting text-lg leading-relaxed mb-4 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {selectedEntry.text.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>

                {selectedEntry.doodleDataURL && (
                  <div className="mb-4">
                    <img 
                      src={selectedEntry.doodleDataURL} 
                      alt="Doodle" 
                      className="w-full h-40 object-contain rounded-lg"
                    />
                  </div>
                )}

                {selectedEntry.stickers && selectedEntry.stickers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedEntry.stickers.map((sticker, index) => (
                      <span key={index} className="text-2xl">{sticker}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/edit-entry/${selectedEntry.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-mint-500 to-mint-600 text-white rounded-xl font-indie font-semibold"
                  >
                    <Edit3 size={16} />
                    Edit Entry
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(selectedEntry.id)}
                    className="px-4 py-3 bg-red-500 text-white rounded-xl font-indie font-semibold hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`max-w-md w-full p-6 rounded-2xl shadow-2xl ${
                  theme === 'light' ? 'bg-white' : 'bg-gray-800'
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🗑️</div>
                  <h3 className={`font-handwriting text-2xl font-bold mb-2 ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  }`}>
                    Delete Entry?
                  </h3>
                  <p className={`font-indie mb-6 ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    This action cannot be undone. Your memory will be lost forever.
                  </p>
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDeleteModal(null)}
                      className={`flex-1 px-4 py-3 rounded-xl font-indie font-semibold ${
                        theme === 'light' 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(showDeleteModal)}
                      className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-indie font-semibold hover:bg-red-600"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Add Button */}
      <Link to="/add-entry">
        <motion.button
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)" 
          }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-lavender-500 to-blush-500 text-white rounded-full shadow-2xl flex items-center justify-center z-40"
        >
          <Plus size={28} />
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default Dashboard;