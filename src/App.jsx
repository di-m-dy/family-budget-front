import {useState,} from "react";
import Main from "./components/Main.jsx";
import Manual from "./components/Manual.jsx";
import Invoice from "./components/Invoice.jsx";


function App() {
    const [page, setPage] = useState('main');
    const [invoice, _setInvoice] = useState(() => {
        const urlParameters = new URLSearchParams(window.location.search);
        return urlParameters.get("invoice");
    });

    if (invoice) {
        return (
            <Invoice invoiceId={invoice}/>
        )
    }

    return (
        page === "main" ?
            <Main page={setPage}/> :
            <Manual page={page} onChangePage={setPage}/>
    )
}

export default App
