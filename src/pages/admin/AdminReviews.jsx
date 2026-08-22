import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Trash2, Edit2, Check, X, Search, MessageSquare } from 'lucide-react';

export function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'reviews'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
        setReviews(reviews.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review.');
      }
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditText(review.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) {
      alert("Review text cannot be empty.");
      return;
    }
    
    try {
      await updateDoc(doc(db, 'reviews', id), {
        text: editText.trim()
      });
      setReviews(reviews.map(r => r.id === id ? { ...r, text: editText.trim() } : r));
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review.');
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-3xl text-dark">Customer Reviews</h2>
          <p className="text-dark/60 font-medium">Manage and moderate community reviews.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-dark/5 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
          <input 
            type="text"
            placeholder="Search by author or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-cream-light/50 border border-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>
        <div className="px-4 py-3 bg-primary/10 text-primary font-heading font-bold rounded-xl whitespace-nowrap">
          Total Reviews: {reviews.length}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-dark/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-light/30 border-b border-dark/5">
                <th className="p-4 font-heading font-bold text-dark/70 uppercase text-xs tracking-wider">Author</th>
                <th className="p-4 font-heading font-bold text-dark/70 uppercase text-xs tracking-wider w-1/2">Review Content</th>
                <th className="p-4 font-heading font-bold text-dark/70 uppercase text-xs tracking-wider">Date</th>
                <th className="p-4 font-heading font-bold text-dark/70 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-dark/50 font-medium">
                    <div className="flex justify-center mb-2">
                      <MessageSquare className="w-8 h-8 animate-bounce text-primary/40" />
                    </div>
                    Loading reviews...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-dark/50 font-medium">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-cream-light/20 transition-colors">
                    <td className="p-4 font-medium text-dark align-top whitespace-nowrap">
                      {review.author_name}
                    </td>
                    <td className="p-4 text-dark/80 align-top">
                      {editingId === review.id ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-3 bg-white border border-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[100px]"
                          autoFocus
                        />
                      ) : (
                        <p className="italic leading-relaxed line-clamp-3">"{review.text}"</p>
                      )}
                    </td>
                    <td className="p-4 text-sm text-dark/60 align-top whitespace-nowrap">
                      {review.created_at?.toDate ? new Date(review.created_at.toDate()).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === review.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(review.id)}
                              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(review)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Edit Review"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
