import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Calendar, Mail, Download, Filter, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { RSVPResponse, RSVPForm } from '../../types';

interface RSVPDashboardProps {
  eventId: string;
}

const RSVPDashboard: React.FC<RSVPDashboardProps> = ({ eventId }) => {
  const { isDark } = useTheme();
  const [responses, setResponses] = useState<RSVPResponse[]>([]);
  const [form, setForm] = useState<RSVPForm | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load data from localStorage
  useEffect(() => {
    const savedResponses = localStorage.getItem(`rsvp_responses_${eventId}`);
    const savedForm = localStorage.getItem(`rsvp_form_${eventId}`);
    
    if (savedResponses) {
      try {
        setResponses(JSON.parse(savedResponses));
      } catch (error) {
        console.error('Error loading RSVP responses:', error);
      }
    }
    
    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm));
      } catch (error) {
        console.error('Error loading RSVP form:', error);
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
          attendance: 'Yes'
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
          attendance: 'Yes'
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
          attendance: 'Maybe'
        },
        submittedAt: new Date(Date.now() - 259200000).toISOString(),
        qrCode: 'QR123458'
      },
      {
        id: '4',
        formId: 'demo',
        eventId,
        responses: {
          name: 'Emily Wilson',
          email: 'emily@example.com',
          phone: '+1-555-0126',
          attendance: 'No'
        },
        submittedAt: new Date(Date.now() - 345600000).toISOString(),
        qrCode: 'QR123459'
      }
    ];
    
    setResponses(demoResponses);
    localStorage.setItem(`rsvp_responses_${eventId}`, JSON.stringify(demoResponses));
  };

  const getStats = () => {
    const total = responses.length;
    const attending = responses.filter(r => r.responses.attendance === 'Yes').length;
    const maybe = responses.filter(r => r.responses.attendance === 'Maybe').length;
    const notAttending = responses.filter(r => r.responses.attendance === 'No').length;
    
    return { total, attending, maybe, notAttending };
  };

  const filteredResponses = responses.filter(response => {
    const matchesSearch = Object.values(response.responses).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'attending' && response.responses.attendance === 'Yes') ||
      (filterStatus === 'maybe' && response.responses.attendance === 'Maybe') ||
      (filterStatus === 'not-attending' && response.responses.attendance === 'No');
    
    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    if (responses.length === 0) return;
    
    const headers = ['Name', 'Email', 'Phone', 'Attendance', 'Submitted At'];
    const csvContent = [
      headers.join(','),
      ...responses.map(response => [
        response.responses.name || '',
        response.responses.email || '',
        response.responses.phone || '',
        response.responses.attendance || '',
        new Date(response.submittedAt).toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp-responses-${eventId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = getStats();

  if (!form && responses.length === 0) {
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
            <Users className={`
              w-12 h-12 transition-colors duration-300
              ${isDark ? 'text-purple-400' : 'text-purple-600'}
            `} />
          </div>
          
          <h2 className={`
            text-2xl font-bold mb-4 transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}>
            No RSVP Data Yet
          </h2>
          
          <p className={`
            text-lg mb-8 max-w-md mx-auto transition-colors duration-300
            ${isDark ? 'text-white/80' : 'text-gray-600'}
          `}>
            Create an RSVP form first to start collecting responses and view analytics
          </p>
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
              RSVP Dashboard
            </h2>
            <p className={`
              transition-colors duration-300
              ${isDark ? 'text-white/70' : 'text-gray-600'}
            `}>
              Track and analyze your event responses
            </p>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`
            p-4 rounded-xl transition-all duration-300
            ${isDark 
              ? 'bg-white/5 border border-white/10' 
              : 'bg-black/5 border border-black/10'
            }
          `}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className={`
                  text-2xl font-bold transition-colors duration-300
                  ${isDark ? 'text-white' : 'text-gray-800'}
                `}>
                  {stats.total}
                </div>
                <div className={`
                  text-sm transition-colors duration-300
                  ${isDark ? 'text-white/60' : 'text-gray-500'}
                `}>
                  Total RSVPs
                </div>
              </div>
            </div>
          </div>

          <div className={`
            p-4 rounded-xl transition-all duration-300
            ${isDark 
              ? 'bg-white/5 border border-white/10' 
              : 'bg-black/5 border border-black/10'
            }
          `}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div className={`
                  text-2xl font-bold transition-colors duration-300
                  ${isDark ? 'text-white' : 'text-gray-800'}
                `}>
                  {stats.attending}
                </div>
                <div className={`
                  text-sm transition-colors duration-300
                  ${isDark ? 'text-white/60' : 'text-gray-500'}
                `}>
                  Attending
                </div>
              </div>
            </div>
          </div>

          <div className={`
            p-4 rounded-xl transition-all duration-300
            ${isDark 
              ? 'bg-white/5 border border-white/10' 
              : 'bg-black/5 border border-black/10'
            }
          `}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Calendar className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <div className={`
                  text-2xl font-bold transition-colors duration-300
                  ${isDark ? 'text-white' : 'text-gray-800'}
                `}>
                  {stats.maybe}
                </div>
                <div className={`
                  text-sm transition-colors duration-300
                  ${isDark ? 'text-white/60' : 'text-gray-500'}
                `}>
                  Maybe
                </div>
              </div>
            </div>
          </div>

          <div className={`
            p-4 rounded-xl transition-all duration-300
            ${isDark 
              ? 'bg-white/5 border border-white/10' 
              : 'bg-black/5 border border-black/10'
            }
          `}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Mail className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <div className={`
                  text-2xl font-bold transition-colors duration-300
                  ${isDark ? 'text-white' : 'text-gray-800'}
                `}>
                  {stats.notAttending}
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
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300
              ${isDark ? 'text-white/60' : 'text-gray-500'}
            `} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search responses..."
              className={`
                w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
                ${isDark 
                  ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                  : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                }
              `}
            />
          </div>

          <div className="relative">
            <Filter className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300
              ${isDark ? 'text-white/60' : 'text-gray-500'}
            `} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`
                pl-10 pr-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 appearance-none
                ${isDark 
                  ? 'bg-white/10 border border-white/20 text-white' 
                  : 'bg-black/10 border border-black/20 text-gray-800'
                }
              `}
            >
              <option value="all">All Responses</option>
              <option value="attending">Attending</option>
              <option value="maybe">Maybe</option>
              <option value="not-attending">Not Attending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Response List */}
      <div className="space-y-3">
        {filteredResponses.length === 0 ? (
          <div className={`
            text-center py-12 transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `}>
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No responses match your search criteria</p>
          </div>
        ) : (
          filteredResponses.map((response) => (
            <div
              key={response.id}
              className={`
                p-4 rounded-xl transition-all duration-300
                ${isDark 
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10' 
                  : 'bg-black/5 border border-black/10 hover:bg-black/10'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h4 className={`
                      text-lg font-semibold transition-colors duration-300
                      ${isDark ? 'text-white' : 'text-gray-800'}
                    `}>
                      {response.responses.name || 'Anonymous'}
                    </h4>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className={`
                        font-medium transition-colors duration-300
                        ${isDark ? 'text-white/80' : 'text-gray-700'}
                      `}>
                        Email:
                      </span>
                      <span className={`
                        ml-2 transition-colors duration-300
                        ${isDark ? 'text-white/60' : 'text-gray-600'}
                      `}>
                        {response.responses.email || 'Not provided'}
                      </span>
                    </div>
                    
                    <div>
                      <span className={`
                        font-medium transition-colors duration-300
                        ${isDark ? 'text-white/80' : 'text-gray-700'}
                      `}>
                        Phone:
                      </span>
                      <span className={`
                        ml-2 transition-colors duration-300
                        ${isDark ? 'text-white/60' : 'text-gray-600'}
                      `}>
                        {response.responses.phone || 'Not provided'}
                      </span>
                    </div>
                    
                    <div>
                      <span className={`
                        font-medium transition-colors duration-300
                        ${isDark ? 'text-white/80' : 'text-gray-700'}
                      `}>
                        Submitted:
                      </span>
                      <span className={`
                        ml-2 transition-colors duration-300
                        ${isDark ? 'text-white/60' : 'text-gray-600'}
                      `}>
                        {new Date(response.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {response.qrCode && (
                  <div className={`
                    px-3 py-2 rounded-lg text-xs font-mono transition-colors duration-300
                    ${isDark 
                      ? 'bg-white/10 text-white/80' 
                      : 'bg-black/10 text-gray-700'
                    }
                  `}>
                    QR: {response.qrCode}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Rate Chart */}
      {stats.total > 0 && (
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
            Response Breakdown
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                Attending ({stats.attending})
              </span>
              <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(stats.attending / stats.total) * 100}%` }}
                ></div>
              </div>
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                {Math.round((stats.attending / stats.total) * 100)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                Maybe ({stats.maybe})
              </span>
              <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{ width: `${(stats.maybe / stats.total) * 100}%` }}
                ></div>
              </div>
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                {Math.round((stats.maybe / stats.total) * 100)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                Not Attending ({stats.notAttending})
              </span>
              <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${(stats.notAttending / stats.total) * 100}%` }}
                ></div>
              </div>
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                {Math.round((stats.notAttending / stats.total) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RSVPDashboard;