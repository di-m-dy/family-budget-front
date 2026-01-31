import {
    Box,
    Button,
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Alert
} from "@mui/material";
import ApiFetch from "../lib/apiFetch.js";
import {useState} from "react";
import defaultArrays from "../lib/defaultArrays.js";

const Manual = ({page, onChangePage}) => {
    const spendItems = defaultArrays().spendItems;
    const incomesItems = defaultArrays().incomesItems;

    const currentItems = page === "spend" ? spendItems : incomesItems;

    const today = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [date, setDate] = useState(today);
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [isEmptyCategory, setIsEmptyCategory] = useState(false);
    const [isEmptyAmount, setIsEmptyAmount] = useState(false);
    const [isEmptyDate, setIsEmptyDate] = useState(false);

    const checkCategory = (value) => {
        if (value.trim().length > 0) {
            setIsEmptyCategory(false);
            return true
        } else {
            setIsEmptyCategory(true);
            return false
        }
    }
    const onChangeCategory = (value) => {
        checkCategory(value);
        setCategory(value);
    }
    const checkAmount = (value) => {
        if (value.trim().length > 0 && Number(value) > 0) {
            setIsEmptyAmount(false)
            return true
        } else {
            setIsEmptyAmount(true)
            return false
        }
    }
    const onChangeAmount = (value) => {
        checkAmount(value);
        setAmount(value);
    }
    const checkDate = (value) => {
        if (value.trim().length > 0) {
            setIsEmptyDate(false)
            return true
        } else {
            setIsEmptyDate(true)
            return false
        }
    }
    const onChangeDate = (value) => {
        setDate(value);
        checkDate(value);
    }

    const onSave = () => {
        console.log("Date: ", date);
        console.log("Amount: ", amount);
        console.log("Category: ", category);

        const cd = checkDate(date);
        const ca = checkAmount(amount)
        const cc = checkCategory(category)

        const result = async () => {
            try {
                const res = await ApiFetch.saveData({date, type: page === "income" ? "доход" : "трата", category, amount});
                console.log('Success: ', res.data)
            } catch (err) {
                console.log('Error: ', err)
            }
        }
        if (cd && ca && cc) {
            void result()
        }
    }

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" justifyContent="center" gap={6} height="90vh">
                <Typography style={{fontWeight: "lighter"}} width='thin' align='center'
                            variant='h3'>{page === "spend" ? "трата" : "прибыль"}</Typography>
                <Card sx={{backgroundColor: 'whitesmoke'}}>
                    <CardContent>
                        <Box display='flex' flexDirection='column' gap={4}>
                            <FormControl>
                                <TextField error={isEmptyDate} value={date}
                                           onChange={(e) => onChangeDate(e.target.value)}
                                           slotProps={{inputLabel: {shrink: true}}} type="date" fullWidth id="date"
                                           placeholder="когда?" label="когда?" variant="outlined"/>
                                <Typography color="error" sx={{fontSize: 10, height: 10}}>{isEmptyDate ? "Должна быть дата": ""}</Typography>
                            </FormControl>

                            <FormControl>
                                <TextField error={isEmptyAmount} slotProps={{inputLabel: {shrink: true}}}
                                           value={amount}
                                           onChange={(e) => onChangeAmount(e.target.value)} type="number" fullWidth
                                           id="currency" label="сколько?" variant="outlined"/>
                                <Typography color="error" sx={{fontSize: 10, height: 10}}>{isEmptyAmount ? "Должна быть заполнено": ""}</Typography>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="category-select-label">категория</InputLabel>
                                <Select error={isEmptyCategory} value={category}
                                        onChange={(e) => onChangeCategory(e.target.value)}
                                        id='category-select' fullWidth variant="outlined" label='категория'
                                        labelId='category-select-label'>
                                    <MenuItem disabled value="">
                                        Категория
                                    </MenuItem>
                                    {
                                        currentItems.map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                                <Typography color="error" sx={{fontSize: 10, height: 10}}>{isEmptyCategory ? "Должна быть выбрано": ""}</Typography>
                            </FormControl>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button onClick={onSave} size="medium">Сохранить</Button>
                        <Button onClick={() => onChangePage('main')} size="medium"
                                color="neutral">Отменить</Button>
                    </CardActions>
                </Card>
            </Box>
        </Container>
    )
}

export default Manual