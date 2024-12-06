import { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {useCookies} from 'react-cookie';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import GoogleButton from '../components/GoogleButton';
import GithubButton from '../components/GithubButton';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['email']);

  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Logged in 
      const user = userCredential.user;
      setCookie("email", user.email);
      navigate("/")
    }).catch(e => {
      console.log(e);
    })
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <GoogleButton>Login with Google</GoogleButton>
        <GithubButton>Login with Github</GithubButton>
        <Link to="/signup">Sign up</Link>
      </Box>
    </Container>
  );
};
