import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Signup from "./pages/Signup";




function App() {

    return (
        <>
            <BrowserRouter>
                <Navbar />

                <Routes>


                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route path="/" element={<Home />} />

                    <Route path="/property/:id" element={<Details />} />
                </Routes>

            </BrowserRouter>
        </>
    );
}

export default App;