import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useCookies } from 'react-cookie';

const GoogleButton = (props) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const [cookies, setCookie] = useCookies(['email']);
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setCookie("email", user.email);

        // Call create_user route
        fetch(`http://127.0.0.1:8080/create_user/${user.email}/${user.displayName.split(' ')[0]}/${user.displayName.split(' ')[1]}`, {
          method: 'GET',
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          navigate("/");
        })
        .catch(e => {
          console.log(e);
        });
      }).catch((error) => {
        console.log(error);
      });
  }

  return (
    <Button
      variant="contained"
      color="secondary"
      fullWidth
      sx={{ mt: 2 }}
      onClick={handleGoogleSignup}
    >
      {props.children}
    </Button>
  )
}

export default GoogleButton;