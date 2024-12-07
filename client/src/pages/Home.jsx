import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Grid, CircularProgress } from '@mui/material';
import BookmarkCard from '../components/BookmarkCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['email']);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8080/search");
        const resJson = await res.json();
        setListings(resJson);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Home</h1>
      {cookies.email ? (
        <p>Welcome, {cookies.email}</p>
      ) : (
        <p>
          Welcome, Please <Link to="/login">Log In</Link> or <Link to="/signup">Sign Up</Link>
        </p>
      )}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3}>
          {listings.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <BookmarkCard listing={item} onAddToBookmarks={null} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Home;