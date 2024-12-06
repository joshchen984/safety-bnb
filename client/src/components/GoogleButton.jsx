
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import {useCookies} from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";

const GoogleButton = (props) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const [cookies, setCookie, removeCookie] = useCookies(['email']);
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setCookie("email", user.email);
        navigate("/");
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
