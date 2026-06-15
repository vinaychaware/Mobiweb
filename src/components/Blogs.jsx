import { useState, useEffect } from 'react';
import { Calendar, User, Clock, ArrowRight, X, BookOpen, Tag } from 'lucide-react';
import { getBlogs } from '../firebase';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    let active = true;
    const fetchBlogsData = async () => {
      try {
        const allBlogs = await getBlogs();
        // Only display published blogs to general audience
        const publishedBlogs = allBlogs.filter(b => b.published);
        if (active) {
          setBlogs(publishedBlogs);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        if (active) {
          setError('Failed to load insights. Please try again later.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchBlogsData();
    return () => {
      active = false;
    };
  }, []);

  // Extract all unique tags
  const tags = ['All', ...new Set(blogs.flatMap(blog => blog.tags || []))];

  // Filter blogs
  const filteredBlogs = activeTag === 'All' 
    ? blogs 
    : blogs.filter(blog => (blog.tags || []).includes(activeTag));

  if (loading) {
    return (
      <section id="blogs" className="py-24 relative overflow-hidden bg-slate-900/10 border-t border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white">Latest Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="glass-card rounded-2xl overflow-hidden border-slate-800 animate-pulse h-96 flex flex-col justify-between">
                <div className="w-full h-48 bg-slate-800" />
                <div className="p-6 space-y-4 flex-grow">
                  <div className="w-16 h-4 bg-slate-850 rounded" />
                  <div className="w-5/6 h-6 bg-slate-850 rounded" />
                  <div className="w-full h-4 bg-slate-850 rounded" />
                  <div className="w-2/3 h-4 bg-slate-850 rounded" />
                </div>
                <div className="p-6 border-t border-slate-850 flex justify-between">
                  <div className="w-20 h-4 bg-slate-850 rounded" />
                  <div className="w-16 h-4 bg-slate-850 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blogs" className="py-24 relative overflow-hidden text-center">
        <p className="text-red-400 font-medium">{error}</p>
      </section>
    );
  }

  return (
    <section id="blogs" className="py-24 relative overflow-hidden bg-slate-900/10 border-t border-slate-900/60">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            <span>Mobiweb Insights</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Knowledge Hub &{' '}
            <span className="gradient-text-cyan-indigo font-extrabold">Tech Blogs</span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 font-light">
            Stay up to date with technology trends, design paradigms, and career strategies authored by our senior engineering mentors.
          </p>
        </div>

        {/* Tag Filters */}
        {tags.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border cursor-pointer transition-all ${
                  activeTag === tag
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-transparent shadow-lg shadow-cyan-500/15'
                    : 'bg-slate-900/50 border-slate-800 text-gray-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl border-slate-800 p-8 max-w-lg mx-auto">
            <p className="text-gray-400 font-light">No articles published in this category yet. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div 
                key={blog.id} 
                className="glass-card rounded-2xl overflow-hidden border-slate-800 flex flex-col justify-between glass-card-hover group transition-all duration-300 relative"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img 
                    src={blog.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'} 
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  {blog.tags && blog.tags[0] && (
                    <span className="absolute top-4 left-4 bg-slate-900/90 text-cyan-400 border border-slate-850 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center">
                      <Tag className="w-2.5 h-2.5 mr-1" />
                      {blog.tags[0]}
                    </span>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Meta info */}
                    <div className="flex items-center space-x-4 text-[11px] text-gray-500 font-light">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                        {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                        {blog.readTime || '3 min read'}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-gray-400 text-xs font-light leading-relaxed line-clamp-3">
                      {blog.summary}
                    </p>
                  </div>

                  {/* Read action */}
                  <div className="pt-6 mt-6 border-t border-slate-850 flex items-center justify-between">
                    <span className="flex items-center text-xs text-gray-400 font-light">
                      <User className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                      {blog.author || 'Mobiweb Writer'}
                    </span>
                    
                    <button 
                      onClick={() => setSelectedBlog(blog)}
                      className="text-cyan-400 hover:text-white text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Details Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl glass-modal rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900/60 to-slate-950/60 p-6 border-b border-slate-850 flex justify-between items-center">
              <div className="flex items-center space-x-3 text-xs text-gray-400 font-light">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                  {new Date(selectedBlog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-gray-700">•</span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                  {selectedBlog.readTime}
                </span>
              </div>
              <button 
                onClick={() => setSelectedBlog(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-8 space-y-6 overflow-y-auto flex-grow text-left">
              {/* Cover Image */}
              <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-850">
                <img 
                  src={selectedBlog.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80'} 
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Author Info */}
              <div className="space-y-4">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  {selectedBlog.title}
                </h2>
                
                <div className="flex items-center justify-between border-y border-slate-850/80 py-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                      {selectedBlog.author ? selectedBlog.author.substring(0, 2).toUpperCase() : 'MW'}
                    </div>
                    <div>
                      <span className="block text-white text-xs font-semibold">{selectedBlog.author || 'Mobiweb Writer'}</span>
                      <span className="block text-gray-500 text-[10px] font-light">Senior Instructor & Mentor</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    {selectedBlog.tags && selectedBlog.tags.map((tag, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-[10px] font-semibold text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* HTML Content (rendered safely in dark mode theme) */}
              <article 
                className="prose dark:prose-invert max-w-none text-gray-300 font-light leading-relaxed space-y-4
                  prose-headings:font-heading prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                  prose-p:text-sm prose-p:leading-relaxed prose-a:text-cyan-400 prose-a:hover:underline
                  prose-code:text-xs prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-cyan-400 prose-code:font-mono
                  prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                  prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-850 bg-slate-950/40 flex justify-end">
              <button 
                onClick={() => setSelectedBlog(null)}
                className="px-6 py-2 rounded-xl bg-slate-900 border border-slate-850 text-xs font-bold text-gray-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
