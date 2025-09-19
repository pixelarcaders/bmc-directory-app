import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Business, NewsletterSubscriber } from '../types';
import { 
  Users, 
  Building2, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Star, 
  Download,
  Eye,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'newsletter' | 'analytics'>('pending');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'newsletter') {
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('subscribed_at', { ascending: false });
        
        if (error) throw error;
        setNewsletterSubscribers(data || []);
      } else {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('status', activeTab)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setBusinesses(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessStatus = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ 
          status,
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error updating business status:', error);
    }
  };

  const toggleFeatured = async (id: string, is_featured: boolean) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ is_featured: !is_featured })
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const deleteBusiness = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting business:', error);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value || '').replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'pending' as const, label: 'Pending', icon: Clock },
    { id: 'approved' as const, label: 'Approved', icon: CheckCircle },
    { id: 'rejected' as const, label: 'Rejected', icon: XCircle },
    { id: 'newsletter' as const, label: 'Newsletter', icon: Mail },
    { id: 'analytics' as const, label: 'Analytics', icon: Users },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              {/* Export Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    if (activeTab === 'newsletter') {
                      exportToCSV(newsletterSubscribers, 'newsletter-subscribers.csv');
                    } else {
                      exportToCSV(businesses, `businesses-${activeTab}.csv`);
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>

              {/* Newsletter Tab */}
              {activeTab === 'newsletter' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Newsletter Subscribers ({newsletterSubscribers.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-2">Email</th>
                          <th className="text-left py-2">Subscribed</th>
                          <th className="text-left py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsletterSubscribers.map((subscriber) => (
                          <tr key={subscriber.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-2">{subscriber.email}</td>
                            <td className="py-2">{new Date(subscriber.subscribed_at).toLocaleDateString()}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                subscriber.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {subscriber.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Analytics Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {businesses.filter(b => b.status === 'pending').length}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Approved</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {businesses.filter(b => b.status === 'approved').length}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Mail className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Newsletter</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {newsletterSubscribers.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Tables */}
              {(activeTab === 'pending' || activeTab === 'approved' || activeTab === 'rejected') && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Businesses ({businesses.length})
                  </h3>
                  <div className="space-y-3">
                    {businesses.map((business) => (
                      <div key={business.id} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white">{business.name}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{business.owner}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{business.category}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              {business.created_at && new Date(business.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {business.is_featured && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                            <button
                              onClick={() => {
                                setSelectedBusiness(business);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {activeTab === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateBusinessStatus(business.id!, 'approved')}
                                  className="p-2 hover:bg-green-100 text-green-600 rounded transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateBusinessStatus(business.id!, 'rejected')}
                                  className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {activeTab === 'approved' && (
                              <button
                                onClick={() => toggleFeatured(business.id!, business.is_featured || false)}
                                className={`p-2 rounded transition-colors ${
                                  business.is_featured 
                                    ? 'bg-yellow-100 text-yellow-600' 
                                    : 'hover:bg-yellow-100 text-slate-600'
                                }`}
                              >
                                <Star className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteBusiness(business.id!)}
                              className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Business Detail Modal */}
      {isDetailModalOpen && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedBusiness.name}
                </h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <div><strong>Owner:</strong> {selectedBusiness.owner}</div>
                <div><strong>Category:</strong> {selectedBusiness.category}</div>
                <div><strong>Email:</strong> {selectedBusiness.contact_email}</div>
                <div><strong>Phone:</strong> {selectedBusiness.contact_phone || 'N/A'}</div>
                <div><strong>Website:</strong> {selectedBusiness.website_url || 'N/A'}</div>
                <div><strong>Address:</strong> {selectedBusiness.address}</div>
                <div><strong>Description:</strong> {selectedBusiness.description}</div>
                <div><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedBusiness.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedBusiness.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedBusiness.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};