import React, { useState, useEffect } from 'react'
import { Drawer as MUIDrawer, ListItemIcon, ListItem, List, ListItemText, Divider } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import MeetingRoomOutlinedIcon from '@material-ui/icons/MeetingRoomOutlined';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import UsersService from '../../../Services/UsersService';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 120;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: 'rgba(222, 184, 135, 0.833)',
        color: 'black',
        width: '100%'
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),

    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },

}));

const Drawer = ({ user, history, handleDrawerOpen, handleDrawerClose, open, setOpen }) => {

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        UsersService.logout(user)
        alert('user logged out')
        window.location = '/login';
    }

    const [userDetails, setUserDetails] = useState()
    const classes = useStyles();
    const theme = useTheme();

    const itemsList = [
        {
            text: 'Home',
            icon: <HomeIcon />,
            onClick: () => history.push('/Main')
        },
        {
            text: 'About',
            icon: <InfoIcon />,
            onClick: () => history.push('/about')
        },
        {
            text: 'Logout',
            icon: <MeetingRoomOutlinedIcon />,
            onClick: handleLogout
        }
    ];

    useEffect(() => {
        const getUser = async () => {
            const userDetail = await UsersService.getUserByID(user)
            setUserDetails(userDetail);
        }
        getUser();
    }, [])
    return (
        <React.Fragment>
            <AppBar position="fixed" className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    {
                        userDetails &&
                        <div style={{ fontSize: '30px', fontWeight: "bolder" }}>
                            Welcome {userDetails.data.firstName} {userDetails.data.lastName}
                        </div>
                    }
                </Toolbar>
            </AppBar>
            <MUIDrawer variant="persistent" className={classes.drawer} anchor="left" open={open} classes={{ paper: classes.drawerPaper }}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />

                <List>
                    {itemsList.map((item, index) => {
                        return (
                            < ListItem button key={item.text} onClick={item.onClick} >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        )
                    })}

                </List>

            </MUIDrawer>
        </React.Fragment>
    )
}
export default withRouter(Drawer)