import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import '../App.css';
import {Link} from "react-router-dom";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.01),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));


export default function NavBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            <Link to={'/'} style={{textDecoration:"none", color:'#fff'}}>
                                Metaphor Finder
                            </Link>
                        </Typography>

                    <Search>
                        <Typography
                            variant = "h6"
                            noWrap
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, }}
                            fontFamily={'Sedgwick Ave Display'}
                        >
                            Your Expressive Language Companion"
                        </Typography>
                    </Search>
                </Toolbar>
            </AppBar>
        </Box>
    );
}