import openQR from '../lib/openQR'
import {Box, Button, ButtonGroup, Container, Typography} from '@mui/material'
import {useNavigate} from "react-router";


const Main = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" justifyContent="center" height="90vh">
                <Typography align='center' variant='h2'>Family Budget</Typography>
                <Box mt={4} mb={4} display={'flex'} justifyContent={"center"}>
                    <ButtonGroup orientation='vertical' variant='text'>
                        <Button size='large' onClick={openQR}>чек</Button>
                        <Button size='large' onClick={() => navigate("/manual?spend=True")}>трата</Button>
                        <Button size='large' onClick={() => navigate('/manual')}>прибыль</Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Container>
    )
}

export default Main