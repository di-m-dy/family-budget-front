import Main from "./components/Main.jsx";
import Manual from "./components/Manual.jsx";
import Invoice from "./components/Invoice.jsx";
import {BrowserRouter, Route, Routes} from "react-router";


function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="manual" element={<Manual/>}/>
                <Route path="invoice" element={<Invoice/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
