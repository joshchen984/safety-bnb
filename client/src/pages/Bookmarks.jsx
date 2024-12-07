import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Grid } from '@mui/material';
import BookmarkCard from '../components/BookmarkCard';
import { useNavigate } from 'react-router-dom';

const Bookmarks = ({ userId }) => {
  const [cookies] = useCookies(['email']);
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.email) {
      navigate('/login');
      return;
    }

    if (cookies.email !== userId) {
      setError('404 Not Found');
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/bookmarked_listings/" + userId);
        if (!response.ok) {
          throw new Error('Error fetching bookmarks');
        }
        const data = await response.json();
        setBookmarks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookmarks();
  }, [cookies.email, userId, navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bookmarked Listings</h1>
      <Grid container spacing={3}>
        {bookmarks.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <BookmarkCard listing={item} onAddToBookmarks={null} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Bookmarks;