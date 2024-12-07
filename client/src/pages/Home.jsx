import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {Grid} from '@mui/material';
import BookmarkCard from '../components/BookmarkCard';

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['email']);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const res = await fetch("http://127.0.0.1:8080/search")
      const resJson = await res.json()
      setListings(resJson);
    }
    fetchListings();
  }, []);
  return (
    <div style={{ padding: '20px' }}>
      <h1>Home</h1>
      <p>Welcome, {cookies.email}</p>
      <Grid container spacing={3}>
        {listings.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <BookmarkCard listing={item} onAddToBookmarks={null}/>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
export default Home;

