import apiFetch from "./apiFetch.js";

const openQR = async () => {
    const telegram = window.Telegram.WebApp;
    const chat_id = telegram?.initDataUnsafe?.user?.id
    telegram.showScanQrPopup(
        {
            text: "Сканируй чек быстро!",
        },
        (qr_event) => {
            apiFetch.scanInvoice({url: qr_event, chat_id})
                .then((response) => {
                    telegram.showPopup({
                        message: response.data.message,
                        buttons: [
                            {
                                type: 'ok',
                                text: 'ОК',
                            },
                        ],
                    }, () => {
                        telegram.close();
                    })
                })
            return true;
        },
    );
};

export default openQR;
