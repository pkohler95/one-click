import React from 'react';
import { Hero } from './Hero';
import { Navbar } from './shared/Navbar';

export const LandingPage = () => {
  return (
    <div>
      <div className="w-11/12 m-auto">
        <Navbar />
        <Hero />
      </div>
    </div>
  );
};
