import React, { useState } from 'react';
import { CSV_TABLE_UI } from '../components';

const DSA = () => {
  return (
    <div className="my-6 px-4 md:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-signature_yellow mb-6 text-center">
        Java + DSA Sheet
      </h1>
      <CSV_TABLE_UI />
    </div>
  );
};

export default DSA;