import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Details from "./pages/Details";

function App() {

    return (
        <>
            <BrowserRouter>
                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/property/:id" element={<Details />} />
                </Routes>

            </BrowserRouter>
        </>
    );
}

export default App;