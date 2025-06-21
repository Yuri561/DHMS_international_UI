import React from 'react';
import '../../styles/styles.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingAnimation: React.FC = () => {
  return (
    <>
    
    <div className="loading-overlay text-white">
      <DotLottieReact
     src="https://lottie.host/59012858-a3d2-4c4c-b57b-fe7e9e5f2e5e/SUiHfPHmJA.lottie"
      loop
      autoplay
      className='w-92 h-92 text-slate-300'
      />
      
      <p className='Loading-text text-white text-lg mx-auto'>Taking you to DHMS International</p>
    </div>
    
    </>
  );
};

export default LoadingAnimation;