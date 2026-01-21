'use client';

import { useEffect, useState } from 'react';
import { mockSmtpSettings } from '@/lib/mockData';
import { Mail, Eye, EyeOff } from 'lucide-react';

export default function SmtpSettings() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    host: '',
    port: '587',
    secure: false,
    username: '',
    password: '',
    fromEmail: '',
    fromName: '',
    isActive: false,
  });

  useEffect(() => {
    // Load existing SMTP settings
    const smtpSetting = mockSmtpSettings[0];
    if (smtpSetting) {
      setFormData({
        host: smtpSetting.host,
        port: smtpSetting.port.toString(),
        secure: smtpSetting.secure,
        username: smtpSetting.username,
        password: smtpSetting.password,
        fromEmail: smtpSetting.fromEmail,
        fromName: smtpSetting.fromName,
        isActive: smtpSetting.isActive,
      });
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    // In production, call API to save SMTP settings
    setTimeout(() => {
      setLoading(false);
      alert('SMTP settings saved!');
    }, 500);
  };

  const handleTest = async () => {
    if (!formData.host || !formData.port || !formData.fromEmail) {
      alert('Please fill in required fields (Host, Port, From Email)');
      return;
    }

    setLoading(true);
    // In production, this would send a test email
    setTimeout(() => {
      setLoading(false);
      alert('Test email sent! Check your inbox.');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* SMTP Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Email Server Configuration</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="host" className="block text-sm font-medium text-gray-700">
                SMTP Host *
              </label>
              <input
                type="text"
                id="host"
                required
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                placeholder="smtp.gmail.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Common: smtp.gmail.com, smtp.outlook.com, smtp.mailgun.org
              </p>
            </div>
            
            <div>
              <label htmlFor="port" className="block text-sm font-medium text-gray-700">
                Port *
              </label>
              <select
                id="port"
                required
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="25">25 (Standard SMTP)</option>
                <option value="465">465 (SSL/TLS)</option>
                <option value="587">587 (STARTTLS - Recommended)</option>
                <option value="2525">2525 (Alternative)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.secure}
                onChange={(e) => setFormData({ ...formData, secure: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Use SSL/TLS (Port 465) - Uncheck for STARTTLS (Port 587)
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username / Email
              </label>
              <input
                type="email"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="your-email@example.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password / App Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter SMTP password"
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                For Gmail, use an App Password instead of your regular password
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Sender Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">
                  From Email Address *
                </label>
                <input
                  type="email"
                  id="fromEmail"
                  required
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  placeholder="noreply@yourcompany.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="fromName" className="block text-sm font-medium text-gray-700">
                  From Name
                </label>
                <input
                  type="text"
                  id="fromName"
                  value={formData.fromName}
                  onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                  placeholder="Your Company Name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Enable SMTP (emails will be sent when enabled)
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleTest}
              disabled={loading || !formData.isActive}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Test Email
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save SMTP Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg shadow p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">SMTP Configuration Help</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Gmail:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Host: smtp.gmail.com</li>
            <li>Port: 587 (STARTTLS) or 465 (SSL)</li>
            <li>Username: Your Gmail address</li>
            <li>Password: Use an App Password (not your regular password)</li>
          </ul>
          <p className="mt-3"><strong>Outlook/Hotmail:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Host: smtp-mail.outlook.com</li>
            <li>Port: 587</li>
            <li>Secure: Unchecked (STARTTLS)</li>
          </ul>
          <p className="mt-3"><strong>Custom SMTP:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Contact your email provider for SMTP settings</li>
            <li>Common ports: 25, 465 (SSL), 587 (STARTTLS)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

