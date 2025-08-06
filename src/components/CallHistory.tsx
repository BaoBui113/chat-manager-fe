"use client";
import React, { useState, useEffect } from 'react';
import CallService from '../services/callService';
import { Call } from '../types/call';

interface CallHistoryProps {
  userId?: string;
}

export const CallHistory: React.FC<CallHistoryProps> = ({ userId }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCallHistory = async () => {
      try {
        setLoading(true);
        const callHistory = await CallService.getCallHistory();
        setCalls(callHistory);
      } catch (err) {
        setError('Failed to load call history');
        console.error('Error fetching call history:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCallHistory();
    }
  }, [userId]);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'missed':
        return 'text-orange-600';
      case 'ended':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'missed':
        return '⏰';
      case 'ended':
        return '📞';
      default:
        return '📞';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No call history found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-4">Call History</h3>
      {calls.map((call) => (
        <div
          key={call.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {call.type === 'video' ? '📹' : '📞'}
              </div>
              <div>
                <div className="font-medium">
                  {call.type === 'video' ? 'Video Call' : 'Voice Call'}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(call.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getStatusColor(call.status)}`}>
                {getStatusIcon(call.status)} {call.status}
              </span>
              {call.duration && (
                <span className="text-sm text-gray-500">
                  {formatDuration(call.duration)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 