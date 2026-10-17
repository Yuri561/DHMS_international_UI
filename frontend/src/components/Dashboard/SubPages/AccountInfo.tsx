import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  UserCircle,
  Mail,
  BadgeInfo,
  Calendar,
  KeyRound,
  MapPin,
  Phone,
} from 'lucide-react';

const AccountInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
          withCredentials: true,
        });
        setUserInfo(res.data.user);
      } catch (err) {
        console.error('Failed to fetch account info', err);
        setError('Failed to load your account information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Account Overview</h2>
        </div>

        <Link
          to="/dashboard/change-password"
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-sm text-black rounded hover:bg-yellow-600 transition"
        >
          <KeyRound size={16} />
          Change Password
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading your information...</p>
      ) : error ? (
        <p className="text-red-600 font-medium">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <BadgeInfo className="w-4 h-4 text-gray-400" />
              Full Name
            </label>
            <div className="text-lg font-semibold text-gray-700">
              {userInfo?.username || 'N/A'}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-gray-400" />
              Username
            </label>
            <div className="text-lg font-semibold text-gray-700">
              {userInfo?.username}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              Email
            </label>
            <div className="text-lg font-semibold text-gray-700">
              {userInfo?.email}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              Member Since
            </label>
            <div className="text-lg font-semibold text-gray-700">
              {new Date(userInfo?.createdAt).toLocaleDateString()}
            </div>
          </div>

          {userInfo?.phone && (
            <div className="space-y-2">
              <label className="text-sm text-gray-500 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Phone
              </label>
              <div className="text-lg font-semibold text-gray-700">
                {userInfo?.phone}
              </div>
            </div>
          )}

          {userInfo?.address && (
            <div className="space-y-2 col-span-full">
              <label className="text-sm text-gray-500 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Address
              </label>
              <div className="text-lg font-medium text-gray-700 leading-6">
                {userInfo?.address}, {userInfo?.city}, {userInfo?.state} {userInfo?.zipCode}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountInfo;
