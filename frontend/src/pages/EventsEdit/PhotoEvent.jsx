import { useEffect, useState } from 'react'
import { getFirebaseImage, deleteFirebaseImage } from '../../common/FirebaseHandler'
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';

export const PhotoEvent = (props) => {

    const [openDialog, setOpenDialog] = useState(false);
    const [imageURL, setImageURL] = useState("");

    const getImage = async () => {
        const url = await getFirebaseImage( `files/${props.nameImage}` );
        setImageURL(url);
    }

    const handleDeletePhoto = () => {
        props.onRemoveImage( props.nameImage );
    }

    useEffect(() => {
        getImage();
    }, [])

  return (
    <>
      <Card sx={{ maxWidth: "100%" }}>
        <CardContent>
            <CardMedia
                component="img"
                height="194"
                image={imageURL}
                alt={props.name}
            />
        </CardContent>
        <CardActions>
          <Grid
            container
            justify-content="center"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Grid item xs={12} style={{ display: props.read !== undefined? 'none': 'flex'}}>
              <Button size="small" onClick={() => setOpenDialog(true)} variant="contained" color="error">Delete Image</Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete this photo?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this photo? This can not be reverted later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>No</Button>
          <Button onClick={handleDeletePhoto} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}