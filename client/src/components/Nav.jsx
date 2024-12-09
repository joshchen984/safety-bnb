import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Nav = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['email']);
  const navigate = useNavigate();

  const handleSignOut = () => {
    removeCookie('email');
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', marginRight: 'auto' }}>
          Safety BnB
        </Typography>
        <Button color="inherit" component={Link} to="/stats">
          Statistics
        </Button>
        <Box>
          {cookies.email ? (
            <>
              <Button color="inherit" component={Link} to={`/bookmarks/${encodeURIComponent(cookies.email)}`}>
                Bookmarks
              </Button>
              <Button color="inherit" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;