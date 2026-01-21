'use client';

import { Activity } from '@/lib/types';
import { formatDateTime } from '@/lib/dateUtils';

interface ActivityTimelineProps {
  activities: Activity[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return <p className="text-sm text-gray-500">No activity yet</p>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="mt-1 h-2 w-2 rounded-full bg-primary-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
            <p className="text-xs text-gray-500 mt-1">
              {activity.user?.name || 'System'} •{' '}
              {formatDateTime(activity.timestamp)}
            </p>
            {activity.metadata && (
              <p className="text-xs text-gray-400 mt-0.5">
                {Object.entries(activity.metadata)
                  .map(([key, value]) => `${key}: ${String(value)}`)
                  .join(' · ')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


