import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const BookmarkCard = ({ listing, onAddToBookmarks, onDeleteFromBookmarks }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Rating: {listing['review_scores_rating']}/100
        </Typography>
        {Object.keys(listing).map((key) => (
          key !== 'review_scores_rating' && (
            <Typography key={key} variant="body2" color="text.secondary">
              {key}: {listing[key]}
            </Typography>
          )
        ))}
      </CardContent>
      <CardActions>
        {onAddToBookmarks ? (
          <Button size="small" onClick={() => onAddToBookmarks(listing.aid)}>Add to Bookmarks</Button>
        ) : (
          <Button size="small" onClick={() => onDeleteFromBookmarks(listing.aid)}>Delete from Bookmarks</Button>
        )}
      </CardActions>
    </Card>
  );
};

export default BookmarkCard;