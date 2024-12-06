import React from 'react';
import { useCookies } from 'react-cookie';

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['email']);

  return (
    <div>
      Home
      {cookies.email}
    </div>
  );
};
export default Home;
