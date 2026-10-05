import React from 'react';
import { createRoot } from 'react-dom/client';
import TranscriptAvtValidator from '../src/validator/TranscriptAvtValidator';
import '../src/styles.css';
import '../src/validator/validator.css';
createRoot(document.getElementById('root')!).render(<TranscriptAvtValidator onBack={()=>{}} />);
