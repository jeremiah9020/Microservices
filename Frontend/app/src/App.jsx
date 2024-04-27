import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar/NavigationBar";

import Login from "./Pages/Login/Login";
// import Blogs from "./pages/Blogs";
// import Contact from "./pages/Contact";
// import NoPage from "./pages/NoPage";

import { useState } from "react";
import { AuthContext } from './Contexts/AuthContext';
import { LocationProvider } from "./Contexts/LocationContext";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import Chef from "./Pages/Chef/Chef";
import Create from "./Pages/Create/Create";

export default function App() {
  const [authContext, setAuthContext] = useState({});

  return (
    <AuthContext.Provider value={authContext}>
      <BrowserRouter>
        <LocationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route id={1} path="/" element={<NavigationBar setAuthInfo={setAuthContext}/>}>
              
              <Route index element={<Home />} />
              <Route path="/chef" element={<Chef />} />
              <Route path="/create" element={<Create />} />

              {/* <Route index element={<Home />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NoPage />} /> */}
            </Route>
          </Routes>
        </LocationProvider>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}