import React, { useState } from 'react';
import { ArrowLeft, Upload, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AddBusinessPageProps {
  onBack: () => void;
}

export const AddBusinessPage: React.FC<AddBusinessPageProps> = ({ onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    description: '',
    website: '',
    category: '',
    certifications: [] as string[],
    email: '',
    phone: '',
    logo: null as File | null,
    address: '',
    socialMedia: {
      facebook: '',
      linkedin: '',
      instagram: '',
      other: ''
    }
  });

  const categories = [
    'Construction',
    'IT Services',
    'Consulting',
    'Healthcare',
    'Education',
    'Real Estate',
    'Legal Services',
    'Creative Services',
    'Retail',
    'Other'
  ];

  const certificationOptions = [
    'Veteran-Owned',
    'Woman-Owned',
    'Minority-Owned'
  ];

  // URL normalization function
  const normalizeUrl = (url: string): string => {
    if (!url || url.trim() === '') return '';
    const trimmedUrl = url.trim();
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      return `https://${trimmedUrl}`;
    }
    return trimmedUrl;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [socialField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCertificationChange = (certification: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError('');
    setFormData(prev => ({ ...prev, logo: file }));
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      console.log('Starting logo upload process...');
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      }
      
      // Validate file size (5MB limit)
      if (file.size > 1 * 1024 * 1024) {
        throw new Error('File size must be less than 1MB');
      }
      
      // Convert file to ArrayBuffer for database storage
      const fileBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      
      console.log('File converted to binary data for database storage');
      
      // Return the file data for database insertion
      return {
        fileData: uint8Array,
        filename: file.name,
        contentType: file.type
      };
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.businessName.trim()) {
        throw new Error('Business name is required');
      }
      if (!formData.ownerName.trim()) {
        throw new Error('Owner name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Business description is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Contact email is required');
      }
      if (!formData.category) {
        throw new Error('Business category is required');
      }
      if (!formData.address.trim()) {
        throw new Error('Business address is required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // URL normalization and validation for website if provided
      if (formData.website && formData.website.trim()) {
        try {
          formData.website = normalizeUrl(formData.website);
          // Validate the normalized URL
          new URL(formData.website);
        } catch {
          throw new Error('Please enter a valid website URL');
        }
      }

      console.log('🔄 Starting business submission to Supabase...');

      // Upload logo if provided
      let logoData = null;
      let logoUploadSkipped = false;
      if (formData.logo) {
        try {
          console.log('Uploading logo:', formData.logo.name);
          logoData = await uploadLogo(formData.logo);
          if (logoData) {
            console.log('Logo processed successfully:', formData.logo.name);
          } else {
            console.log('Logo processing skipped');
            logoUploadSkipped = true;
          }
        } catch (logoError) {
          console.error('Logo processing failed:', logoError);
          console.warn('Logo processing failed, continuing without logo');
          logoUploadSkipped = true;
        }
      }

      // Prepare data for database
      const businessData = {
        business_name: formData.businessName,
        owner_name: formData.ownerName,
        business_description: formData.description,
        website_url: formData.website ? normalizeUrl(formData.website) : null,
        business_category: formData.category,
        certifications: formData.certifications,
        logo_file: logoData ? logoData.fileData : null,
        logo_filename: logoData ? logoData.filename : null,
        logo_content_type: logoData ? logoData.contentType : null,
        contact_email: formData.email,
        contact_phone: formData.phone || null,
        business_address: formData.address,
        social_media: formData.socialMedia,
        status: 'pending'
      };

      console.log('Inserting business data into Supabase:', businessData);

      // Insert into database
      const { data: insertedData, error: dbError } = await supabase
        .from('businesses')
        .insert([businessData]);

      if (dbError) throw dbError;

      console.log('Business successfully inserted:', insertedData);

      // Send notification email
      try {
        console.log('Sending notification email...');
        await supabase.functions.invoke('send-business-notification', {
          body: {
            businessName: formData.businessName,
            ownerName: formData.ownerName,
            contactEmail: formData.email
          }
        });
        console.log('Notification email sent successfully');
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      setIsSuccess(true);
      
    } catch (error) {
      console.error('Submission error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while submitting your business');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    // Reset form and go back to directory
    setFormData({
      businessName: '',
      ownerName: '',
      description: '',
      website: '',
      category: '',
      certifications: [],
      email: '',
      phone: '',
      logo: null,
      address: '',
      socialMedia: {
        facebook: '',
        linkedin: '',
        instagram: '',
        other: ''
      }
    });
    setIsSuccess(false);
    setError('');
    onBack();
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-y-auto">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 z-10">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors mr-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isSuccess ? 'Submission Complete' : 'Add Your Business'}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {isSuccess ? (
          /* Success State */
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Thank you for your submission!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              Your business has been submitted for review. We'll notify you once it's approved and live in the directory.
            </p>
            <button
              onClick={handleSuccessClose}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Directory
            </button>
          </div>
        ) : (
          /* Form */
          <div className="max-w-2xl mx-auto">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Owner's Name *
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Business Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Business Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Website URL
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="example.com"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Business Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Business Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Certifications
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {certificationOptions.map(cert => (
                    <label key={cert} className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={() => handleCertificationChange(cert)}
                        disabled={isSubmitting}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>







              

              
              {/* Contact Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Business Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Business Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="123 Main St, Staten Island, NY 10314"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  This address will be used for Apple Maps integration
                </p>
              </div>

              {/* Social Media Links */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Social Media Links
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    name="socialMedia.facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleInputChange}
                    placeholder="Facebook URL"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    name="socialMedia.linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={handleInputChange}
                    placeholder="LinkedIn URL"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    name="socialMedia.instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleInputChange}
                    placeholder="Instagram URL"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    name="socialMedia.other"
                    value={formData.socialMedia.other}
                    onChange={handleInputChange}
                    placeholder="Other Social Media URL"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-lg font-semibold transition-colors text-white ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Business'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};