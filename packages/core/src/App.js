// packages/core/src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';  // Redux for global state
import { useAuth } from './services/authService';  // Extended from your existing

// Lazy load persona modules for bundle splitting/scalability
const CoachModule = React.lazy(() => import('@ivylevel/coach'));
const StudentModule = React.lazy(() => import('@ivylevel/student'));
const ParentModule = React.lazy(() => import('@ivylevel/parent'));
const ManagerModule = React.lazy(() => import('@ivylevel/manager'));

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<div>Loading Module...</div>}>
          <Routes>
            {/* Dynamic routing by persona - extensible for new CUJs */}
            <Route path="/coach/*" element={<CoachModule user={user} />} />  // CUJs 6-9
            <Route path="/student/*" element={<StudentModule user={user} />} />  // Future student CUJs
            <Route path="/parent/*" element={<ParentModule user={user} />} />    // Parent CUJs
            <Route path="/manager/*" element={<ManagerModule user={user} />} />  // CUJ 8 + future
            <Route path="/" element={<div>Redirecting based on role: {user?.role}</div>} />
            <Route path="*" element={<div>404 - Add new routes here for expansion</div>} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App; 