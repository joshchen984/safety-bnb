import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [cookies, setCookie] = useCookies(['email']);

  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        setCookie("email", user.email);

        // Call create_user route
        fetch(`${process.env.REACT_APP_SERVER_URL}/create_user/${email}/${firstname}/${lastname}`, {
          method: 'GET',
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error creating user in database');
          }
          navigate("/");
        })
        .catch(e => {
          console.log(e);
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Signup
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Signup
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
