import React, { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  Grid,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import BookmarkCard from '../components/BookmarkCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['email']);
  const [listings, setListings] = useState([]);
  const listingSubset = useMemo(() => listings.slice(0, 20), [listings]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8080/search');
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

  const [price, setPrice] = useState('');
  const [country, setCountry] = useState('');
  const [guests, setGuests] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [minRating, setMinRating] = useState('');
  const [minAttacksSameCountry, setMinAttacksSameCountry] = useState('');

  const handleSearch = async () => {
    const filters = {
      price,
      country,
      guests,
      bedrooms,
      min_rating: minRating,
      min_attacks_same_country: minAttacksSameCountry,
    };

    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
    ).toString();

    const res = await fetch(`http://127.0.0.1:8080/search?${query}`);
    const resJson = await res.json();
    setListings(resJson);
  };

  return (
    <div style={{ padding: '20px' }}>
      {cookies.email ? (
        <p>Welcome, {cookies.email}</p>
      ) : (
        <p>
          Welcome, Please <Link to="/login">Log In</Link> or{' '}
          <Link to="/signup">Sign Up</Link>
        </p>
      )}
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          {' '}
          <Typography variant="h1">See Listings</Typography>
          <p>Welcome, {cookies.email}</p>
          <div style={{ marginBottom: '20px' }}>
            <TextField
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <TextField
              label="Guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
            <TextField
              label="Minimum Bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            />
            <TextField
              label="Min Rating"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            />
            <TextField
              label="Min Attacks Same Country"
              value={minAttacksSameCountry}
              onChange={(e) => setMinAttacksSameCountry(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>
          <Typography variant="h2">Map</Typography>
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
                <BookmarkCard listing={item} onAddToBookmarks={null} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default Home;
