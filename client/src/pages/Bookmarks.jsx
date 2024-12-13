import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Grid, Typography, Button } from '@mui/material';
import BookmarkCard from '../components/BookmarkCard';
import { useNavigate, useParams, Link } from 'react-router-dom';

const Bookmarks = () => {
  const { userId } = useParams();
  const [cookies] = useCookies(['email']);
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.email) {
      navigate('/login');
      return;
    }

    const encodedCookie = encodeURIComponent(cookies.email);
    const encodedUserId = encodeURIComponent(userId);

    if (encodedCookie !== encodedUserId) {
      console.log(`${encodedCookie} !== ${encodedUserId}`);
      setError('404 Not Found');
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/bookmarked_listings/${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching bookmarks for user ${userId}`);
        }
        const data = await response.json();
        console.log('Fetched bookmarks:', data);
        setBookmarks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookmarks();
  }, [cookies.email, userId, navigate]);

  const handleDeleteFromBookmarks = async (aid) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/delete_bookmark/${cookies.email}/${aid}`);
      if (!res.ok) {
        throw new Error('Error deleting bookmark');
      }
      setBookmarks(bookmarks.filter(bookmark => bookmark.aid !== aid));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      alert(`Error deleting bookmark: ${error}`);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bookmarked Listings</h1>
      {bookmarks.length === 0 ? (
        <div>
          <Typography variant="h6">No Bookmarks Found.</Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Go to Home Page
          </Button>
        </div>
      ) : (
        <Grid container spacing={3}>
          {bookmarks.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <BookmarkCard listing={item} onAddToBookmarks={null} onDeleteFromBookmarks={handleDeleteFromBookmarks} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Bookmarks;
