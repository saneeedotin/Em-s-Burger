import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Search, Check, Save } from 'lucide-react';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function AdminMenu() {
  const { items, categories, addItem, updateItem, deleteItem, addCategory, updateCategory, deleteCategory } = useMenu();
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'categories'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null for new item, or item object
  const [formData, setFormData] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // Filters
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        id: `item-${Date.now()}`,
        name: '',
        category: categories[0]?.id || 'classic',
        price: '',
        description: '',
        isVeg: false,
        isSignature: false,
        badge: '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const storageRef = ref(storage, `menu-images/${fileName}`);

      await uploadBytes(storageRef, file);
      
      // Get public URL
      const publicURL = await getDownloadURL(storageRef);

      setFormData(prev => ({ ...prev, image: publicURL }));
    } catch (error) {
      console.error('Error uploading image:', error.message);
      alert('Error uploading image. Make sure Firebase Storage is configured and rules allow uploads.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation
    if (!formData.name || !formData.price || !formData.category) return;

    const finalItem = {
      ...formData,
      price: Number(formData.price)
    };

    if (editingItem) {
      updateItem(finalItem.id, finalItem);
    } else {
      addItem(finalItem);
    }
    closeModal();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-dark">Menu Management</h2>
          <p className="text-dark/60 mt-1">Add, edit, or remove menu items and categories.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-heading font-bold shadow-md transition-transform hover:-translate-y-1"
        >
          <Plus size={20} />
          <span>New Item</span>
        </button>
      </div>

      <div className="flex items-center gap-4 border-b-2 border-dark/10 pb-4">
        <button 
          onClick={() => setActiveTab('items')}
          className={`font-heading font-bold text-lg transition-colors ${activeTab === 'items' ? 'text-primary' : 'text-dark/40 hover:text-dark/70'}`}
        >
          Menu Items ({items.length})
        </button>
        {/* Simplified tab for now, we'll focus on items */}
      </div>

      {activeTab === 'items' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
            <input 
              type="text" 
              placeholder="Search items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-dark/10 rounded-2xl py-3 pl-12 pr-4 font-body outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-dark/5 flex flex-col group hover:shadow-md transition-all">
                <div className="aspect-video bg-cream-light relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark/20">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  {item.badge && (
                    <span className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-heading font-black text-lg text-dark leading-tight">{item.name}</h3>
                    <span className="font-mono font-bold text-primary shrink-0">₹{item.price}</span>
                  </div>
                  <p className="text-dark/60 text-sm line-clamp-2 mb-4">{item.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-dark/5">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.isVeg ? 'bg-accent text-dark' : 'bg-primary/10 text-primary'}`}>
                      {item.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(item)} className="p-2 text-dark/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="p-2 text-dark/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl animate-scaleUp my-8">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-dark/5 text-dark/60 hover:text-dark transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-heading font-black text-2xl text-dark mb-6">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload Area */}
                <div className="md:col-span-2 space-y-2">
                  <label className="font-bold text-dark text-sm">Item Image</label>
                  <div className="relative border-2 border-dashed border-dark/20 rounded-2xl overflow-hidden bg-cream-light hover:bg-cream transition-colors group h-48 flex items-center justify-center">
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white font-bold flex items-center gap-2"><ImageIcon size={20}/> Change Image</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-dark/40">
                        <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                        <p className="font-medium text-sm">Click to upload image</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-dark text-sm">Item Name *</label>
                  <input type="text" name="name" required value={formData.name || ''} onChange={handleChange} className="w-full bg-cream-light border-2 border-transparent rounded-xl p-3 focus:border-primary outline-none transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <label className="font-bold text-dark text-sm">Price (₹) *</label>
                  <input type="number" name="price" required value={formData.price || ''} onChange={handleChange} className="w-full bg-cream-light border-2 border-transparent rounded-xl p-3 focus:border-primary outline-none transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-dark text-sm">Category *</label>
                  <select name="category" required value={formData.category || ''} onChange={handleChange} className="w-full bg-cream-light border-2 border-transparent rounded-xl p-3 focus:border-primary outline-none transition-colors">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="font-bold text-dark text-sm">Badge (Optional)</label>
                  <input type="text" name="badge" placeholder="e.g. Bestseller" value={formData.badge || ''} onChange={handleChange} className="w-full bg-cream-light border-2 border-transparent rounded-xl p-3 focus:border-primary outline-none transition-colors" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="font-bold text-dark text-sm">Description</label>
                  <textarea name="description" rows="3" value={formData.description || ''} onChange={handleChange} className="w-full bg-cream-light border-2 border-transparent rounded-xl p-3 focus:border-primary outline-none transition-colors resize-none"></textarea>
                </div>

                <div className="md:col-span-2 flex gap-6 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" name="isVeg" checked={formData.isVeg || false} onChange={handleChange} className="sr-only" />
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${formData.isVeg ? 'bg-primary border-primary' : 'border-dark/30 group-hover:border-primary'}`}>
                        {formData.isVeg && <Check size={14} className="text-white" />}
                      </div>
                    </div>
                    <span className="font-bold text-dark">Vegetarian Item</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" name="isSignature" checked={formData.isSignature || false} onChange={handleChange} className="sr-only" />
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${formData.isSignature ? 'bg-primary border-primary' : 'border-dark/30 group-hover:border-primary'}`}>
                        {formData.isSignature && <Check size={14} className="text-white" />}
                      </div>
                    </div>
                    <span className="font-bold text-dark">Signature Item</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-dark/10 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold text-dark/60 hover:text-dark transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isUploading} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-heading font-bold shadow-md transition-transform hover:-translate-y-1 disabled:opacity-50">
                  <Save size={18} />
                  <span>{editingItem ? 'Save Changes' : 'Create Item'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
