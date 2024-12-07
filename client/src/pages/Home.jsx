import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {Grid} from '@mui/material';
import BookmarkCard from '../components/BookmarkCard';

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['email']);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      await fetch("localhost:8080/")
    }
    fetchListings();
    setListings([
      {
        "accommodates": 2,
        "aid": 101,
        "bathrooms": 1,
        "bedrooms": 1,
        "beds": 1,
        "city": "New York",
        "country": "United States",
        "extra_people": 10,
        "guests_included": 1,
        "latitude": 40.7128,
        "longitude": -74.0060,
        "maximum_nights": 14,
        "minimum_nights": 1,
        "neighborhood": "Manhattan",
        "number_of_reviews": 150,
        "price": 150,
        "property_type": "Apartment",
        "review_scores_rating": 4.8,
        "state": "NY"
      },
      {
        "accommodates": 4,
        "aid": 102,
        "bathrooms": 2,
        "bedrooms": 2,
        "beds": 3,
        "city": "Paris",
        "country": "France",
        "extra_people": 20,
        "guests_included": 2,
        "latitude": 48.8566,
        "longitude": 2.3522,
        "maximum_nights": 30,
        "minimum_nights": 3,
        "neighborhood": "Le Marais",
        "number_of_reviews": 85,
        "price": 220,
        "property_type": "Condo",
        "review_scores_rating": 4.7,
        "state": "Île-de-France"
      },
      {
        "accommodates": 6,
        "aid": 103,
        "bathrooms": 2.5,
        "bedrooms": 3,
        "beds": 4,
        "city": "Tokyo",
        "country": "Japan",
        "extra_people": 25,
        "guests_included": 4,
        "latitude": 35.6895,
        "longitude": 139.6917,
        "maximum_nights": 60,
        "minimum_nights": 2,
        "neighborhood": "Shinjuku",
        "number_of_reviews": 200,
        "price": 300,
        "property_type": "House",
        "review_scores_rating": 4.9,
        "state": "Tokyo"
      },
      {
        "accommodates": 8,
        "aid": 104,
        "bathrooms": 3,
        "bedrooms": 4,
        "beds": 5,
        "city": "Sydney",
        "country": "Australia",
        "extra_people": 30,
        "guests_included": 6,
        "latitude": -33.8688,
        "longitude": 151.2093,
        "maximum_nights": 90,
        "minimum_nights": 5,
        "neighborhood": "Bondi",
        "number_of_reviews": 50,
        "price": 400,
        "property_type": "Villa",
        "review_scores_rating": 4.6,
        "state": "New South Wales"
      },
      {
        "accommodates": 1,
        "aid": 105,
        "bathrooms": 1,
        "bedrooms": 1,
        "beds": 1,
        "city": "London",
        "country": "United Kingdom",
        "extra_people": 15,
        "guests_included": 1,
        "latitude": 51.5074,
        "longitude": -0.1278,
        "maximum_nights": 10,
        "minimum_nights": 1,
        "neighborhood": "Camden",
        "number_of_reviews": 75,
        "price": 120,
        "property_type": "Studio",
        "review_scores_rating": 4.5,
        "state": "England"
      },
      {
        "accommodates": 5,
        "aid": 106,
        "bathrooms": 2,
        "bedrooms": 3,
        "beds": 4,
        "city": "Cape Town",
        "country": "South Africa",
        "extra_people": 20,
        "guests_included": 3,
        "latitude": -33.9249,
        "longitude": 18.4241,
        "maximum_nights": 40,
        "minimum_nights": 3,
        "neighborhood": "Sea Point",
        "number_of_reviews": 95,
        "price": 180,
        "property_type": "Apartment",
        "review_scores_rating": 4.4,
        "state": "Western Cape"
      },
      {
        "accommodates": 3,
        "aid": 107,
        "bathrooms": 1,
        "bedrooms": 2,
        "beds": 2,
        "city": "Barcelona",
        "country": "Spain",
        "extra_people": 12,
        "guests_included": 2,
        "latitude": 41.3851,
        "longitude": 2.1734,
        "maximum_nights": 25,
        "minimum_nights": 2,
        "neighborhood": "Gothic Quarter",
        "number_of_reviews": 130,
        "price": 160,
        "property_type": "Loft",
        "review_scores_rating": 4.6,
        "state": "Catalonia"
      }
    ]
    )
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

