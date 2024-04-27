import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const LocationContext = createContext({previous: null, current: null});

export function LocationProvider({ children }) {
    const [currentLocation, setCurrentLocation] = useState('/');
    const [previousLocation, setPreviousLocation] = useState('/');
    const location = useLocation();
  
    useEffect(() => {
      if (!['/register','/login'].includes(location.pathname)) {
        setPreviousLocation(currentLocation);
        setCurrentLocation(location.pathname + location.search);
      }
    }, [location]);
  
    return (
      <LocationContext.Provider value={{previous: previousLocation, current: currentLocation}}>
        {children}
      </LocationContext.Provider>
    );
}
