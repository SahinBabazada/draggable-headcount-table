import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormatPage from './FormatPage/FormatPage';
import FunctionalAreaPage from './FunctionalAreaPage/FunctionalAreaPage';
import PositionPage from './PositionPage/PositionPage';
import ProjectPage from './ProjectPage/ProjectPage';
import SectionPage from './SectionPage/SectionPage';
import StorePage from './StorePage.js/StorePage';
import NavigationBar from './NavigationPanel/NavigationBar';
import DraggableTable from './DraggableTable';
import HeadcountPage from './HeadcountPage/HeadcountPage';

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/formats" element={<FormatPage />} />
        <Route path="/functional-areas" element={<FunctionalAreaPage />} />
        <Route path="/positions" element={<PositionPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/sections" element={<SectionPage />} />
        <Route path="/stores" element={<StorePage />} />
        <Route path="/headcount" element={<DraggableTable />} />
        <Route path="/" element= {<HeadcountPage/>} />
      </Routes>
    </Router>
  );
};

export default App;


