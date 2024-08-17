import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import TimeTrackingPage from './pages/TimeTrackingPage';

const App: React.FC = () => {
  return (
   <>
 <Router>
      <Navbar />
      <div className="container mx-auto p-4">
     <Routes> 
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/tasks/:projectId" element={<TasksPage />} />
          <Route path="/time-tracking" element={<TimeTrackingPage />} /> 
        </Routes> 
      </div>
   </Router> 
   </>
  );
};

export default App;

