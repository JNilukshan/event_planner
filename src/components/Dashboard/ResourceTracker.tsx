import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Package, Minus, Upload, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Resource } from '../../types';

interface ResourceTrackerProps {
  eventId: string;
}

const ResourceTracker: React.FC<ResourceTrackerProps> = ({ eventId }) => {
  const { isDark } = useTheme();
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState({ name: '', quantity: 1, image: '' });
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', quantity: 1, image: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Load resources from localStorage
  useEffect(() => {
    const savedResources = localStorage.getItem(`resources_${eventId}`);
    if (savedResources) {
      try {
        setResources(JSON.parse(savedResources));
      } catch (error) {
        console.error('Error loading resources:', error);
      }
    }
  }, [eventId]);

  // Save resources to localStorage
  useEffect(() => {
    localStorage.setItem(`resources_${eventId}`, JSON.stringify(resources));
  }, [resources, eventId]);

  const handleImageUpload = (file: File, isEditing: boolean = false) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (isEditing) {
        setEditData(prev => ({ ...prev, image: imageUrl }));
      } else {
        setNewResource(prev => ({ ...prev, image: imageUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const addResource = () => {
    if (newResource.name.trim() && newResource.quantity > 0) {
      const resource: Resource = {
        id: Date.now().toString(),
        eventId,
        name: newResource.name.trim(),
        quantity: newResource.quantity,
        image: newResource.image,
        createdAt: new Date().toISOString()
      };
      setResources(prev => [...prev, resource]);
      setNewResource({ name: '', quantity: 1, image: '' });
      setShowAddForm(false);
    }
  };

  const deleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(resource => resource.id !== resourceId));
  };

  const startEditing = (resource: Resource) => {
    setEditingResource(resource.id);
    setEditData({ 
      name: resource.name, 
      quantity: resource.quantity,
      image: resource.image || ''
    });
  };

  const saveEdit = () => {
    if (editData.name.trim() && editData.quantity > 0 && editingResource) {
      setResources(prev => prev.map(resource => 
        resource.id === editingResource 
          ? { ...resource, name: editData.name.trim(), quantity: editData.quantity, image: editData.image }
          : resource
      ));
      setEditingResource(null);
      setEditData({ name: '', quantity: 1, image: '' });
    }
  };

  const cancelEdit = () => {
    setEditingResource(null);
    setEditData({ name: '', quantity: 1, image: '' });
  };

  const updateQuantity = (resourceId: string, change: number) => {
    setResources(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, quantity: Math.max(0, resource.quantity + change) }
        : resource
    ));
  };

  const totalResources = resources.reduce((total, resource) => total + resource.quantity, 0);

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <div className={`
      p-4 rounded-xl transition-all duration-300 group
      ${isDark 
        ? 'bg-white/5 border border-white/10 hover:bg-white/10' 
        : 'bg-black/5 border border-black/10 hover:bg-black/10'
      }
    `}>
      <div className="flex items-start space-x-4">
        {/* Resource Image */}
        <div className="flex-shrink-0">
          {resource.image ? (
            <img
              src={resource.image}
              alt={resource.name}
              className="w-16 h-16 rounded-lg object-cover border-2 border-purple-400/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Package className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        {/* Resource Info */}
        <div className="flex-1 min-w-0">
          {editingResource === resource.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
                  ${isDark 
                    ? 'bg-white/10 border border-white/20 text-white' 
                    : 'bg-black/10 border border-black/20 text-gray-800'
                  }
                `}
                placeholder="Resource name"
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={editData.quantity}
                  onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) || 1 })}
                  className={`
                    w-20 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
                    ${isDark 
                      ? 'bg-white/10 border border-white/20 text-white' 
                      : 'bg-black/10 border border-black/20 text-gray-800'
                    }
                  `}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
                  className="hidden"
                  id={`edit-image-${resource.id}`}
                />
                <label
                  htmlFor={`edit-image-${resource.id}`}
                  className={`
                    px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 text-sm
                    ${isDark 
                      ? 'bg-white/10 hover:bg-white/20 text-white/80' 
                      : 'bg-black/10 hover:bg-black/20 text-gray-600'
                    }
                  `}
                >
                  <ImageIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={saveEdit}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <h4 className={`
                text-lg font-semibold mb-2 transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {resource.name}
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={`
                    text-sm transition-colors duration-300
                    ${isDark ? 'text-white/60' : 'text-gray-500'}
                  `}>
                    Added {new Date(resource.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => updateQuantity(resource.id, -1)}
                      disabled={resource.quantity <= 0}
                      className={`
                        p-1 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                        ${isDark 
                          ? 'text-white/60 hover:text-white hover:bg-white/10' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-black/10'
                        }
                      `}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className={`
                      px-3 py-1 rounded-lg text-lg font-bold min-w-[3rem] text-center transition-colors duration-300
                      ${isDark 
                        ? 'bg-white/10 text-white' 
                        : 'bg-black/10 text-gray-800'
                      }
                    `}>
                      {resource.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(resource.id, 1)}
                      className={`
                        p-1 rounded transition-colors duration-200
                        ${isDark 
                          ? 'text-white/60 hover:text-white hover:bg-white/10' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-black/10'
                        }
                      `}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Edit/Delete */}
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => startEditing(resource)}
                      className={`
                        p-2 rounded-lg transition-colors duration-200
                        ${isDark 
                          ? 'text-white/60 hover:text-white hover:bg-white/10' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-black/10'
                        }
                      `}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteResource(resource.id)}
                      className="p-2 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`
          text-2xl font-bold mb-2 transition-colors duration-300
          ${isDark ? 'text-white' : 'text-gray-800'}
        `}>
          Resource Tracker
        </h2>
        <p className={`
          transition-colors duration-300
          ${isDark ? 'text-white/70' : 'text-gray-600'}
        `}>
          Track quantities and manage resources needed for your event
        </p>
        {resources.length > 0 && (
          <div className={`
            mt-3 text-sm transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `}>
            Total items: {totalResources} across {resources.length} resource types
          </div>
        )}
      </div>

      {/* Add Resource Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-6 flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Resource</span>
        </button>
      )}

      {/* Add New Resource Form */}
      {showAddForm && (
        <div className={`
          p-6 rounded-xl mb-6 transition-all duration-300
          ${isDark 
            ? 'bg-white/5 border border-white/10' 
            : 'bg-black/5 border border-black/10'
          }
        `}>
          <h3 className={`
            text-lg font-semibold mb-4 transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}>
            Add New Resource
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`
                  block text-sm font-medium mb-2 transition-colors duration-300
                  ${isDark ? 'text-white/90' : 'text-gray-700'}
                `}>
                  Resource Name
                </label>
                <input
                  type="text"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                  placeholder="e.g., Chairs, Tables, Microphones"
                  className={`
                    w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
                    ${isDark 
                      ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                      : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                    }
                  `}
                />
              </div>
              
              <div>
                <label className={`
                  block text-sm font-medium mb-2 transition-colors duration-300
                  ${isDark ? 'text-white/90' : 'text-gray-700'}
                `}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={newResource.quantity}
                  onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value) || 1 })}
                  className={`
                    w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
                    ${isDark 
                      ? 'bg-white/10 border border-white/20 text-white' 
                      : 'bg-black/10 border border-black/20 text-gray-800'
                    }
                  `}
                />
              </div>
            </div>

            <div>
              <label className={`
                block text-sm font-medium mb-2 transition-colors duration-300
                ${isDark ? 'text-white/90' : 'text-gray-700'}
              `}>
                Resource Image (Optional)
              </label>
              <div className="flex items-center space-x-4">
                {newResource.image && (
                  <img
                    src={newResource.image}
                    alt="Resource preview"
                    className="w-16 h-16 rounded-lg object-cover border-2 border-purple-400/20"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                  id="resource-image"
                />
                <label
                  htmlFor="resource-image"
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200
                    ${isDark 
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                      : 'bg-black/10 hover:bg-black/20 text-gray-800 border border-black/20'
                    }
                  `}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Image</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={addResource}
                disabled={!newResource.name.trim() || newResource.quantity < 1}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Resource
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewResource({ name: '', quantity: 1, image: '' });
                }}
                className={`
                  px-6 py-2 rounded-lg transition-colors duration-200
                  ${isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-gray-800'
                  }
                `}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource List */}
      <div className="space-y-4">
        {resources.length === 0 ? (
          <div className={`
            text-center py-12 transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `}>
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No resources tracked yet</p>
            <p className="text-sm">Add your first resource to start tracking event materials</p>
            <div className="mt-4 text-xs space-y-1">
              <p>💡 Examples: Chairs (50), Tables (10), Microphones (3)</p>
              <p>🖼️ Add images to visualize your resources</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>

      {/* Resource Summary */}
      {resources.length > 0 && (
        <div className={`
          mt-8 p-6 rounded-xl transition-all duration-300
          ${isDark 
            ? 'bg-white/5 border border-white/10' 
            : 'bg-black/5 border border-black/10'
          }
        `}>
          <h3 className={`
            text-lg font-semibold mb-4 transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}>
            Resource Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {resources.length}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                Resource Types
              </div>
            </div>
            <div className="text-center">
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {totalResources}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                Total Items
              </div>
            </div>
            <div className="text-center">
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {resources.length > 0 ? Math.round(totalResources / resources.length) : 0}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                Avg per Type
              </div>
            </div>
            <div className="text-center">
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {resources.length > 0 ? Math.max(...resources.map(r => r.quantity)) : 0}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                Highest Qty
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceTracker;