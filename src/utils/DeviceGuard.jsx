import React, { useState, useEffect } from 'react';
import Unsupported from '../pages/Unsupported';

const DeviceGuard = ({ children }) => {
  const [isSupported, setIsSupported] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsSupported(window.innerWidth >= 1024);
    };

    handleResize(); // check at mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isSupported) return <Unsupported />;
  return children;
};

export default DeviceGuard;
