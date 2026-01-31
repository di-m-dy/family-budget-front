import openQR from '../lib/openQR'
import {Container, Typography, Box, Button, ButtonGroup} from '@mui/material'


const Main = ({page}) => {
    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" justifyContent="center" height="90vh">
                <Typography align='center' variant='h2'>Family Budget</Typography>
                <Box mt={4} mb={4} display={'flex'} justifyContent={"center"}>
                    <ButtonGroup orientation='vertical' variant='text'>
                        <Button size='large' onClick={openQR}>чек</Button>
                        <Button size='large' onClick={() => page('spend')}>трата</Button>
                        <Button size='large' onClick={() => page('income')}>прибыль</Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Container>
    )
}

export default Main