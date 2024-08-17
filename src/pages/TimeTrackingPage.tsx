import React from 'react';
import TimeEntryList from '../components/TimeTracking/TimeEntryList';

const TimeTrackingPage: React.FC = () => {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Time Tracking</h1>
      <TimeEntryList />
    </div>
  );
};

export default TimeTrackingPage;
