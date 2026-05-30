import React from 'react';
import Navbar from '../components/Layout/Navbar/Navbar';
import Footer from '../components/Layout/Footer/Footer';
import SimulationView from '../features/simulation/SimulationView';

const SimulationPage = () => {
  return (
    <>
      <Navbar />
      <main className="simulation-main-page">
        <SimulationView />
      </main>
      <Footer />
    </>
  );
};

export default SimulationPage;