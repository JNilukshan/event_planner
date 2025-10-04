import React, { useState, useEffect } from 'react';
import { QrCode, Search, Mail, Download, Eye, Users, Calendar, MapPin, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { RSVPResponse, Event } from '../../types';

interface QRCodesProps {
  eventId: string;
}

const QRCodes: React.FC<QRCodesProps> = ({ eventId }) => {
  const { isDark } = useTheme();
  const [responses, setResponses] = useState<RSVPResponse[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<RSVPResponse | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedResponses = localStorage.getItem(`rsvp_responses_${eventId}`);
    const savedEvents = localStorage.getItem('events');
    
    if (savedResponses) {
      try {
        setResponses(JSON.parse(savedResponses));
      } catch (error) {
        console.error('Error loading RSVP responses:', error);
      }
    }
    
    if (savedEvents) {
      try {
        const events = JSON.parse(savedEvents);
        const currentEvent = events.find((e: Event) => e.id === eventId);
        setEvent(currentEvent || null);
      } catch (error) {
        console.error('Error loading event:', error);
      }
    }

    // Generate demo data if no responses exist
    if (!savedResponses) {
      generateDemoData();
    }
  }, [eventId]);

  const generateDemoData = () => {
    const demoResponses: RSVPResponse[] = [
      {
        id: '1',
        formId: 'demo',
        eventId,
        responses: {
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+1-555-0123',
          attendance: 'Yes',
          dietary: 'Vegetarian',
          guests: '2'
        },
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        qrCode: 'QR123456'
      },
      {
        id: '2',
        formId: 'demo',
        eventId,
        responses: {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1-555-0124',
          attendance: 'Yes',
          dietary: 'None',
          guests: '1'
        },
        submittedAt: new Date(Date.now() - 172800000).toISOString(),
        qrCode: 'QR123457'
      },
      {
        id: '3',
        formId: 'demo',
        eventId,
        responses: {
          name: 'Mike Davis',
          email: 'mike@example.com',
          phone: '+1-555-0125',
          attendance: 'Maybe',
          dietary: 'Gluten-free',
          guests: '3'
        },
        submittedAt: new Date(Date.now() - 259200000).toISOString(),
        qrCode: 'QR123458'
      }
    ];
    
    setResponses(demoResponses);
    localStorage.setItem(`rsvp_responses_${eventId}`, JSON.stringify(demoResponses));
  };

  const generateQRCodeSVG = (data: string) => {
    // Simple QR code-like pattern using SVG
    const size = 200;
    const modules = 21; // Standard QR code is 21x21 modules
    const moduleSize = size / modules;
    
    // Create a pattern based on the data
    const pattern = [];
    for (let i = 0; i < modules * modules; i++) {
      const hash = data.charCodeAt(i % data.length) + i;
      pattern.push(hash % 2 === 0);
    }

    return (
      <svg width={size} height={size} className="border-2 border-gray-300 rounded-lg">
        {pattern.map((filled, index) => {
          const row = Math.floor(index / modules);
          const col = index % modules;
          return filled ? (
            <rect
              key={index}
              x={col * moduleSize}
              y={row * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill={isDark ? '#ffffff' : '#000000'}
            />
          ) : null;
        })}
      </svg>
    );
  };

  const sendQRCodeEmail = (response: RSVPResponse) => {
    const subject = `QR Code for ${event?.name || 'Event'}`;
    const body = `Hi ${response.responses.name},

Thank you for your RSVP! Here are your event details:

Event: ${event?.name}
Date: ${event ? new Date(event.date).toLocaleDateString() : 'TBD'}
Time: ${event?.time || 'TBD'}
Venue: ${event?.venue || 'TBD'}

Your QR Code: ${response.qrCode}

Please save this email and bring your QR code to the event for quick check-in.

Best regards,
EventMaster Team`;

    const mailtoLink = `mailto:${response.responses.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const downloadQRCode = (response: RSVPResponse) => {
    // Create a canvas to generate downloadable QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 400;

    // Background
    ctx.fillStyle = isDark ? '#1a1a1a' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(event?.name || 'Event', canvas.width / 2, 30);

    // Guest name
    ctx.font = '16px Arial';
    ctx.fillText(response.responses.name || 'Guest', canvas.width / 2, 60);

    // QR Code placeholder (simplified pattern)
    const qrSize = 200;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = 80;
    
    ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    
    // Create pattern
    ctx.fillStyle = isDark ? '#1a1a1a' : '#ffffff';
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if ((i + j + response.qrCode.charCodeAt(0)) % 3 === 0) {
          ctx.fillRect(qrX + i * 10, qrY + j * 10, 10, 10);
        }
      }
    }

    // QR Code text
    ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    ctx.font = '14px monospace';
    ctx.fillText(response.qrCode, canvas.width / 2, qrY + qrSize + 30);

    // Download
    const link = document.createElement('a');
    link.download = `qr-code-${response.responses.name}-${response.qrCode}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const filteredResponses = responses.filter(response =>
    Object.values(response.responses).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    ) || response.qrCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (responses.length === 0) {
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
            <QrCode className={`
              w-12 h-12 transition-colors duration-300
              ${isDark ? 'text-purple-400' : 'text-purple-600'}
            `} />
          </div>
          
          <h2 className={`
            text-2xl font-bold mb-4 transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}>
            No QR Codes Yet
          </h2>
          
          <p className={`
            text-lg mb-8 max-w-md mx-auto transition-colors duration-300
            ${isDark ? 'text-white/80' : 'text-gray-600'}
          `}>
            QR codes will be generated automatically when guests submit RSVP responses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`
          text-2xl font-bold mb-2 transition-colors duration-300
          ${isDark ? 'text-white' : 'text-gray-800'}
        `}>
          QR Codes
        </h2>
        <p className={`
          transition-colors duration-300
          ${isDark ? 'text-white/70' : 'text-gray-600'}
        `}>
          Manage QR codes for event check-in and guest verification
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className={`
            absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or QR code..."
            className={`
              w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
              ${isDark 
                ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
              }
            `}
          />
        </div>
      </div>

      {/* QR Code Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResponses.map((response) => (
          <div
            key={response.id}
            className={`
              p-6 rounded-xl transition-all duration-300 group
              ${isDark 
                ? 'bg-white/5 border border-white/10 hover:bg-white/10' 
                : 'bg-black/5 border border-black/10 hover:bg-black/10'
              }
            `}
          >
            {/* Guest Info */}
            <div className="text-center mb-4">
              <h3 className={`
                text-lg font-bold mb-1 transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {response.responses.name || 'Anonymous'}
              </h3>
              <p className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-600'}
              `}>
                {response.responses.email}
              </p>
              <span className={`
                inline-block px-2 py-1 rounded-full text-xs font-medium mt-2
                ${response.responses.attendance === 'Yes'
                  ? 'bg-green-500/20 text-green-400'
                  : response.responses.attendance === 'Maybe'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }
              `}>
                {response.responses.attendance || 'Unknown'}
              </span>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-lg">
                {generateQRCodeSVG(response.qrCode)}
              </div>
            </div>

            {/* QR Code Text */}
            <div className="text-center mb-4">
              <p className={`
                text-xs transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                QR Code
              </p>
              <p className={`
                font-mono text-lg font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {response.qrCode}
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedResponse(response)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors duration-200
                  ${isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-gray-800'
                  }
                `}
                title="View Details"
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm">View</span>
              </button>
              
              <button
                onClick={() => sendQRCodeEmail(response)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors duration-200
                  ${isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-gray-800'
                  }
                `}
                title="Email QR Code"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email</span>
              </button>
              
              <button
                onClick={() => downloadQRCode(response)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors duration-200
                  ${isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-gray-800'
                  }
                `}
                title="Download QR Code"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Scanner Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`
            w-full max-w-md backdrop-blur-lg rounded-2xl p-6 transition-all duration-300
            ${isDark 
              ? 'bg-white/10 border border-white/20' 
              : 'bg-black/10 border border-black/20'
            }
          `}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`
                text-xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                Guest Details
              </h3>
              <button
                onClick={() => setSelectedResponse(null)}
                className={`
                  p-2 rounded-full transition-colors duration-200
                  ${isDark 
                    ? 'hover:bg-white/10 text-white' 
                    : 'hover:bg-black/10 text-gray-800'
                  }
                `}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Event Info */}
            {event && (
              <div className={`
                p-4 rounded-xl mb-6 transition-all duration-300
                ${isDark 
                  ? 'bg-white/5 border border-white/10' 
                  : 'bg-black/5 border border-black/10'
                }
              `}>
                <h4 className={`
                  font-semibold mb-3 transition-colors duration-300
                  ${isDark ? 'text-white' : 'text-gray-800'}
                `}>
                  {event.name}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className={`h-4 w-4 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className={`h-4 w-4 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {event.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className={`h-4 w-4 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {event.venue}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Guest Details */}
            <div className={`
              p-4 rounded-xl mb-6 transition-all duration-300
              ${isDark 
                ? 'bg-white/5 border border-white/10' 
                : 'bg-black/5 border border-black/10'
              }
            `}>
              <h4 className={`
                font-semibold mb-3 transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                Guest Information
              </h4>
              <div className="space-y-3">
                {Object.entries(selectedResponse.responses).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className={`
                      text-sm font-medium capitalize transition-colors duration-300
                      ${isDark ? 'text-white/80' : 'text-gray-700'}
                    `}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className={`
                      text-sm transition-colors duration-300
                      ${isDark ? 'text-white/60' : 'text-gray-600'}
                    `}>
                      {String(value)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className={`
                    text-sm font-medium transition-colors duration-300
                    ${isDark ? 'text-white/80' : 'text-gray-700'}
                  `}>
                    Submitted:
                  </span>
                  <span className={`
                    text-sm transition-colors duration-300
                    ${isDark ? 'text-white/60' : 'text-gray-600'}
                  `}>
                    {new Date(selectedResponse.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Display */}
            <div className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg mb-4">
                {generateQRCodeSVG(selectedResponse.qrCode)}
              </div>
              <p className={`
                font-mono text-lg font-bold mb-4 transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {selectedResponse.qrCode}
              </p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => sendQRCodeEmail(selectedResponse)}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                >
                  Email QR Code
                </button>
                <button
                  onClick={() => downloadQRCode(selectedResponse)}
                  className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {responses.length > 0 && (
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
            QR Code Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {responses.length}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                Total QR Codes
              </div>
            </div>
            
            <div className="text-center">
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {responses.filter(r => r.responses.attendance === 'Yes').length}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                Attending
              </div>
            </div>
            
            <div className="text-center">
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {responses.filter(r => r.responses.attendance === 'Maybe').length}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                Maybe
              </div>
            </div>
            
            <div className="text-center">
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {responses.filter(r => r.responses.attendance === 'No').length}
              </div>
              <div className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                Not Attending
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodes;