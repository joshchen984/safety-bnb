import { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import GoogleButton from '../components/GoogleButton';
import {useCookies} from 'react-cookie';
import { Link } from 'react-router-dom';
import GithubButton from '../components/GithubButton';



export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['email']);

  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
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
          Signup
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
            Signup
          </Button>
        </form>
        <GoogleButton>Signup with Google</GoogleButton>
        <GithubButton>Signup with Github</GithubButton>
        <Link to="/login">Login</Link>
      </Box>
    </Container>
  );
};
