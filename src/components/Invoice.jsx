import {
    Box,
    Button,
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Alert
} from "@mui/material";

import { blue } from '@mui/material/colors';
import { CircularProgress } from '@mui/material';
import ApiFetch from "../lib/apiFetch.js";
import {useEffect, useState} from "react";
import defaultArrays from "../lib/defaultArrays.js";

const Invoice = ({invoiceId}) => {
    const telegram = window.Telegram.WebApp;

    const spendItems = defaultArrays().spendItems;

    const [invoiceData, setInvoiceData] = useState();
    const [load, setLoad] = useState(true);
    const [error, setError] = useState(null);
    const [generalCategory, setGeneralCategory] = useState('');
    const [categoriesPrices, setCategoriesPrices] = useState([]);
    const [notAllError, setNotAllError] = useState(false);
    const [sendInvoiceLoading, setSendInvoiceLoading] = useState(false);
    const [sendInvoiceError, setSendInvoiceError] = useState(null);

    const addPriceToCategory = (title, category, price) => {
        setNotAllError(false);
        setCategoriesPrices((prev) => ([
        ...prev,
        {title, category, price}
        ]))
    }

    const handleGeneralCategory = (category) => {
        setNotAllError(false);
        setCategoriesPrices([])
        setGeneralCategory(category)
    }

    useEffect(() => {
        const getInvoice = async () => {
            try {
                const response = await ApiFetch.getInvoice(invoiceId)
                setInvoiceData(response.data)
            } catch(err) {
                console.log("Error: ", err)
                setError(err.message);
            } finally {
                setLoad(false);
            }
        }
        void getInvoice();
    }, [])

    const calcDataCategories = () => {
        const result = Object.values(
            categoriesPrices.reduce((acc, i) => {
                const key = i.category;
                acc[key] = acc[key] || { category: key, amount: i.price.replace(" EUR", "").replace(",", ".") * 100 };
                acc[key].amount += i.price.replace(" EUR", "").replace(",", ".") * 100;
                return acc;
            }, {})
            );
        return result
    }

    const sendData = async () => {
        if (generalCategory) {
            const result = {
                date: invoiceData.date,
                items: [{category: generalCategory, amount: invoiceData.amount.replace(" EUR", "").replace(",", ".") * 100}]
            }
            try {
                setSendInvoiceLoading(true)
                const response = await ApiFetch.sendInvoiceData(result)
                if (response) {
                    telegram.close()
                }
            } catch(err) {
                setSendInvoiceError(err.message)
            } finally {
                setSendInvoiceLoading(false)
            }
        } else {
            if (categoriesPrices.length < invoiceData.items.length) {
                console.log("not all error")
                setNotAllError(true);
                return
            }
            const result = {items: calcDataCategories(), date: invoiceData.date}
            try {
                setSendInvoiceLoading(true)
                const response = await ApiFetch.sendInvoiceData(result)
                if (response) {
                    telegram.close()
                }
            } catch(err) {
                setSendInvoiceError(err.message)
            } finally {
                setSendInvoiceLoading(false)
            }
        }
    }

    if (load) {
        return (
            <Box  position="absolute" top="50%" left="50%" style={{transform: "translate(-50%, -50%"}}>
                <CircularProgress size={60} align="center" thickness={4.2} />
            </Box>
        )
    }

    if (error) {
        return (
            <div>
                <h1>Error:</h1>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" gap={6} minHeight="90vh" marginY={10}>
                <Typography display="flex" flexDirection="column" style={{fontWeight: "lighter", marginBottom: 0}} width='thin' align='center'
                            variant='h4'>Чек<Typography style={{fontWeight: "lighter", fontSize: 14}} variant="body">{invoiceData.date}</Typography></Typography>
                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="category-select-label">категория</InputLabel>
                        <Select
                                value={generalCategory}
                                onChange={(e) => handleGeneralCategory(e.target.value)}
                                id='category-select' fullWidth variant="outlined" label='категория'
                                labelId='category-select-label'>
                            <MenuItem disabled value="">
                                Категория
                            </MenuItem>
                            {
                                spendItems.map((item) => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box display="flex" flexDirection="column" gap={1}>
                    {
                        !generalCategory ? (invoiceData.items.length > 0 ? invoiceData.items.map((i) => (
                            <Card key={i.title}>
                                <CardContent>
                                    <Typography fontWeight="lighter">{i.title}</Typography>
                                    <Typography fontSize={16} variant="subtitle2">{i.price}</Typography>
                                </CardContent>
                                <CardActions>
                                    <FormControl fullWidth>
                                        <InputLabel id="category-select-label">категория</InputLabel>
                                        <Select
                                                value={categoriesPrices.find((item) => item.title === i.title)?.category || ''}
                                                onChange={(e) => addPriceToCategory(i.title, e.target.value, i.price)}
                                                id='category-select' fullWidth variant="outlined" label='категория'
                                                labelId='category-select-label'>
                                            <MenuItem disabled value="">
                                                Категория
                                            </MenuItem>
                                            {
                                                spendItems.map((item) => (
                                                    <MenuItem key={item} value={item}>
                                                        {item}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </CardActions>
                            </Card>
                        )) : <Typography align="center" fontWeight="lighter" variant="body2">Нет позиций</Typography>):
                        <Card style={{background: blue[100]}}>
                            <CardContent>
                                <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                                    <Typography align="center" fontWeight="normal" variant="subtitle2">
                                    Выбрана общая категория:  <Typography fontWeight="lighter" variant="span">{generalCategory}</Typography>
                                    </Typography>
                                    <Typography align="center" fontWeight="normal" variant="subtitle2">
                                        Сумма:  <Typography fontWeight="lighter" variant="span">{invoiceData.amount}</Typography>
                                    </Typography>
                                    <Button onClick={() => setGeneralCategory('')} style={{borderRadius: 36}} variant="contained" size="small" align="center" color="neutral">Очистить</Button>
                                </Box>
                            </CardContent>
                        </Card>   
                    }
                </Box>
                
                { notAllError &&
                    <Alert variant="outlined" severity="warning">
                        Не все позиции отсортированны
                    </Alert>
                }

                { sendInvoiceError &&
                    <Alert variant="outlined" severity="error">
                        {sendInvoiceError}
                    </Alert>
                }
                
                <Box display="flex" gap={4} alignItems="center" alignSelf="center" marginY={2}>
                    <Button loading={sendInvoiceLoading} onClick={() => sendData()} variant="contained" size="large">Сохранить</Button>
                    <Button onClick={telegram.close} size="large" color="neutral">Отменить</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default Invoice