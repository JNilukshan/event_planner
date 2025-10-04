import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, Eye, Share2, Copy, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { RSVPForm, RSVPField } from '../../types';

interface RSVPFormBuilderProps {
  eventId: string;
}

const RSVPFormBuilder: React.FC<RSVPFormBuilderProps> = ({ eventId }) => {
  const { isDark } = useTheme();
  const [form, setForm] = useState<RSVPForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load form from localStorage
  useEffect(() => {
    const savedForm = localStorage.getItem(`rsvp_form_${eventId}`);
    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm));
      } catch (error) {
        console.error('Error loading RSVP form:', error);
      }
    }
  }, [eventId]);

  // Save form to localStorage
  useEffect(() => {
    if (form) {
      localStorage.setItem(`rsvp_form_${eventId}`, JSON.stringify(form));
    }
  }, [form, eventId]);

  const createNewForm = () => {
    const newForm: RSVPForm = {
      id: Date.now().toString(),
      eventId,
      fields: [
        { id: '1', name: 'name', type: 'text', required: true, placeholder: 'Your full name' },
        { id: '2', name: 'email', type: 'email', required: true, placeholder: 'your@email.com' }
      ],
      thankYouMessage: 'Thank you for your RSVP! We look forward to seeing you at the event.',
      isActive: true
    };
    setForm(newForm);
    setIsEditing(true);
  };

  const addField = () => {
    if (!form) return;
    
    const newField: RSVPField = {
      id: Date.now().toString(),
      name: 'new_field',
      type: 'text',
      required: false,
      placeholder: 'Enter placeholder text'
    };
    
    setForm({
      ...form,
      fields: [...form.fields, newField]
    });
  };

  const updateField = (fieldId: string, updates: Partial<RSVPField>) => {
    if (!form) return;
    
    setForm({
      ...form,
      fields: form.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    });
  };

  const deleteField = (fieldId: string) => {
    if (!form) return;
    
    setForm({
      ...form,
      fields: form.fields.filter(field => field.id !== fieldId)
    });
  };

  const getShareableLink = () => {
    return `${window.location.origin}/rsvp/${eventId}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareableLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const FieldEditor = ({ field }: { field: RSVPField }) => (
    <div className={`
      p-4 rounded-xl border transition-all duration-300
      ${isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-black/5 border-black/10'
      }
    `}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={field.name}
            onChange={(e) => updateField(field.id, { name: e.target.value })}
            className={`
              flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
              ${isDark 
                ? 'bg-white/10 border border-white/20 text-white' 
                : 'bg-black/10 border border-black/20 text-gray-800'
              }
            `}
            placeholder="Field name"
          />
          <button
            onClick={() => deleteField(field.id)}
            className="ml-2 p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={field.type}
            onChange={(e) => updateField(field.id, { type: e.target.value as RSVPField['type'] })}
            className={`
              px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
              ${isDark 
                ? 'bg-white/10 border border-white/20 text-white' 
                : 'bg-black/10 border border-black/20 text-gray-800'
              }
            `}
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="select">Dropdown</option>
            <option value="radio">Radio</option>
            <option value="checkbox">Checkbox</option>
            <option value="file">File Upload</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(field.id, { required: e.target.checked })}
              className="rounded"
            />
            <span className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
              Required
            </span>
          </label>
        </div>

        <input
          type="text"
          value={field.placeholder || ''}
          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
          className={`
            w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
            ${isDark 
              ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
              : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
            }
          `}
          placeholder="Placeholder text"
        />

        {(field.type === 'select' || field.type === 'radio') && (
          <textarea
            value={field.options?.join('\n') || ''}
            onChange={(e) => updateField(field.id, { options: e.target.value.split('\n').filter(o => o.trim()) })}
            className={`
              w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
              ${isDark 
                ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
              }
            `}
            placeholder="Options (one per line)"
            rows={3}
          />
        )}
      </div>
    </div>
  );

  if (!form) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className={`
            w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto transition-all duration-300
            ${isDark 
              ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30' 
              : 'bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200'
            }
          `}>
            <Edit2 className={`
              w-12 h-12 transition-colors duration-300
              ${isDark ? 'text-purple-400' : 'text-purple-600'}
            `} />
          </div>
          
          <h2 className={`
            text-2xl font-bold mb-4 transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}>
            Create RSVP Form
          </h2>
          
          <p className={`
            text-lg mb-8 max-w-md mx-auto transition-colors duration-300
            ${isDark ? 'text-white/80' : 'text-gray-600'}
          `}>
            Build a custom RSVP form for your event with drag-and-drop fields
          </p>
          
          <button
            onClick={createNewForm}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create RSVP Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`
              text-2xl font-bold mb-2 transition-colors duration-300
              ${isDark ? 'text-white' : 'text-gray-800'}
            `}>
              RSVP Form Builder
            </h2>
            <p className={`
              transition-colors duration-300
              ${isDark ? 'text-white/70' : 'text-gray-600'}
            `}>
              Customize your event RSVP form
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`
                px-4 py-2 rounded-lg transition-colors duration-200
                ${isEditing
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-black/10 hover:bg-black/20 text-gray-800'
                }
              `}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Shareable Link */}
        <div className={`
          p-4 rounded-xl transition-all duration-300
          ${isDark 
            ? 'bg-white/5 border border-white/10' 
            : 'bg-black/5 border border-black/10'
          }
        `}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`
                font-semibold mb-1 transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                Shareable RSVP Link
              </h3>
              <p className={`
                text-sm font-mono transition-colors duration-300
                ${isDark ? 'text-white/70' : 'text-gray-600'}
              `}>
                {getShareableLink()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={copyLink}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                  ${copied
                    ? 'bg-green-500 text-white'
                    : isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-black/10 hover:bg-black/20 text-gray-800'
                  }
                `}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <a
                href={getShareableLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200
                  ${isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-gray-800'
                  }
                `}
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm">Preview</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <>
          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className={`
                text-lg font-semibold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                Form Fields
              </h3>
              <button
                onClick={addField}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Field</span>
              </button>
            </div>

            {form.fields.map((field) => (
              <FieldEditor key={field.id} field={field} />
            ))}
          </div>

          {/* Thank You Message */}
          <div className="mb-6">
            <label className={`
              block text-sm font-medium mb-2 transition-colors duration-300
              ${isDark ? 'text-white/90' : 'text-gray-700'}
            `}>
              Thank You Message
            </label>
            <textarea
              value={form.thankYouMessage}
              onChange={(e) => setForm({ ...form, thankYouMessage: e.target.value })}
              className={`
                w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
                ${isDark 
                  ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                  : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                }
              `}
              rows={3}
              placeholder="Message shown after successful RSVP submission"
            />
          </div>
        </>
      )}

      {/* Form Preview */}
      {!isEditing && (
        <div className={`
          p-6 rounded-xl transition-all duration-300
          ${isDark 
            ? 'bg-white/5 border border-white/10' 
            : 'bg-black/5 border border-black/10'
          }
        `}>
          <h3 className={`
            text-lg font-semibold mb-4 transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}>
            Form Preview
          </h3>
          
          <div className="space-y-4">
            {form.fields.map((field) => (
              <div key={field.id}>
                <label className={`
                  block text-sm font-medium mb-1 transition-colors duration-300
                  ${isDark ? 'text-white/90' : 'text-gray-700'}
                `}>
                  {field.name} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'select' ? (
                  <select className={`
                    w-full px-3 py-2 rounded-lg transition-all duration-300
                    ${isDark 
                      ? 'bg-white/10 border border-white/20 text-white' 
                      : 'bg-black/10 border border-black/20 text-gray-800'
                    }
                  `}>
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'radio' ? (
                  <div className="space-y-2">
                    {field.options?.map((option, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input type="radio" name={field.name} value={option} />
                        <span className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : field.type === 'checkbox' ? (
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {field.placeholder}
                    </span>
                  </label>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`
                      w-full px-3 py-2 rounded-lg transition-all duration-300
                      ${isDark 
                        ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                        : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                      }
                    `}
                  />
                )}
              </div>
            ))}
            
            <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium">
              Submit RSVP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RSVPFormBuilder;