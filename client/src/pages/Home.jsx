import React, { useEffect, useState, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { Grid, Typography, CircularProgress } from '@mui/material';
import BookmarkCard from '../components/BookmarkCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['email']);
  const [listings, setListings] = useState([]);
  const listingSubset = useMemo(() => listings.slice(0, 20), [listings]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/search`);
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

  const handleAddToBookmarks = async (aid) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/create_bookmark/${cookies.email}/${aid}`, {
        method: 'GET',
      });
      if (!res.ok) {
        throw new Error('Error adding bookmark');
      }
      navigate(`/bookmarks/${cookies.email}`);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      alert('Error adding bookmark');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Home</h1>
      {cookies.email ? (
        <p>Welcome, {cookies.email}</p>
      ) : (
        <p>
          Welcome, please <Link to="/login">Log In</Link>
        </p>
      )}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: '400px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {listingSubset.map((item, index) => (
              <Marker key={index} position={[item.latitude, item.longitude]}>
                <Popup>Rating: {item.review_scores_rating}</Popup>
              </Marker>
            ))}
          </MapContainer>
          <Typography variant="h2">Listings</Typography>
          <Grid container spacing={3}>
            {listings.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <BookmarkCard listing={item} onAddToBookmarks={handleAddToBookmarks} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default Home;
