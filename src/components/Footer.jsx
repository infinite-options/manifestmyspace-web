import { Grid, Box, Paper, ThemeProvider, Button } from '@mui/material';
import theme from '../theme/theme';
import Home_fill from '../images/Home_fill.png'
import Bell_fill from '../images/Bell_fill.png'
import User_fill from '../images/User_fill.png'
import comment_fill from '../images/comment_fill.png'

export function Footer() {
    return (
        <footer className="footer">
        <ThemeProvider theme={theme}>
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    backgroundColor: theme.palette.priority.clear,
                    marginTop: '55px',
                    height: '40px'
                }}
            >
                <Grid
                    container 
                    justify="center"
                    alignItems="center"
                    style={{
                        width: '85%',
                    }}
                >
                    <Grid item xs={3}>
                    <Box>
                    <a href='/'><img src={Home_fill} alt="Home Icon" style={{ display: 'block', margin: '0 auto' }} /></a>
                    </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <a href='/ownerProfile'><img src={User_fill} alt="User Icon" style={{ display: 'block', margin: '0 auto' }}/></a>
                    </Grid>
                    <Grid item xs={3}>
                        <img src={Bell_fill} alt="Bell Icon" style={{ display: 'block', margin: '0 auto' }} />
                    </Grid>
                    <Grid item xs={3}>
                        <img src={comment_fill} alt="Comment Icon" style={{ display: 'block', margin: '0 auto' }}/>
                    </Grid>
                    </Grid>
            </Box>
        </ThemeProvider>
        </footer>
    )
}