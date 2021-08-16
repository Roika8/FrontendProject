import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogRequest = ({ userName, senderID, answer }) => {
    const [open, setOpen] = React.useState(false);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    const handleNoAnswer = () => {
        setOpen(false);
        answer([false, senderID])
    };
    const handleYesAnswer = () => {
        setOpen(false);
        answer([true, senderID])

    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Slide in alert dialog
            </Button> */}
            <Dialog
                open={true}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"You recive a game request !"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {userName} Invite you to a game, Do you agree?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNoAnswer} color="primary">
                        No..
                    </Button>
                    <Button onClick={handleYesAnswer} color="primary">
                        Sure! lets play
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default DialogRequest;