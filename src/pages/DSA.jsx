
import React from 'react';
import CSV_TABLE_UI from '../components/CSV_TABLE_UI';
import AnimatedElement from '@/components/AnimatedElement';
import Section from '@/components/Section';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DSA = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 flex-grow">
        <AnimatedElement animation="fadeIn">
          <Section
            title="Java + DSA Sheet"
            subtitle="Master data structures and algorithms with our comprehensive learning path"
            contentClassName="mt-8"
            gradient
          >
            <AnimatedElement animation="fadeIn" delay="100">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
                <CSV_TABLE_UI />
              </div>
            </AnimatedElement>
          </Section>
        </AnimatedElement>
      </div>
      
      <Footer />
    </div>
  );
};

export default DSA;
