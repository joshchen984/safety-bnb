import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Safety BnB
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to = "/login">Login</Button>
          <Button color="inherit" component={Link} to = "/signup">Signup</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
