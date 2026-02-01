import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiUrl = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
})

const ApiFetch = {
    sendMessage: ({chat_id, text}) => apiUrl.post('send_message', {chat_id, text}),
    scanInvoice: ({url, chat_id}) => apiUrl.post('parse_invoice', {url, chat_id}),
    saveData: ({date, type, amount, category}) => apiUrl.post('save_to_sheet', {date, type, amount, category}),
    getInvoice: (invoiceId) => apiUrl.post(`invoice/${invoiceId}`),
    sendInvoiceData: ({date, items}) => apiUrl.post('invoice-to-sheet', {date, items})
}

export default ApiFetch