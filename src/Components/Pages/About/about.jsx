import React, { useState } from 'react'
import './about.css'

import Drawer from '../../Elements/Navbar/drawer';
//Styles
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import './about.css';

//images
const drawerWidth = 155;
const useStyles = makeStyles((theme) => ({
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        marginTop: '75px',
        flexGrow: 1,
        display: 'flex',
        padding: theme.spacing(0),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 20,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 60,
    },
}));

const About = () => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <div className="aboutWrapper">
            <Drawer handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} open={open} setOpen={setOpen} />
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className="contentHeader">
                    <h1 class="page-title mainHeader"> ChatGammon instructions
                    </h1>
                    <div className="miniHeader">
                        Backgammon is one of the oldest board games with origins dating as far back as 3000 BC. It is a game of luck and strategy and popular around the world.
                    </div>

                    <div className="miniHeader">
                        Easy to learn and fun to play, it is no wonder why it has withstood the test of time and is played by so many people.
                    </div>


                    <div className="littleHeader">
                        Equipment
                    </div>
                    <p>
                        The game is played by two players each, with fifteen checkers of his own color.

                        Each player also has their own pair of dice and dice cup.

                        A doubling cube with the numbers 2, 4, 8, 16, 32, 64 is used for tracking the stakes of the round.

                        The board consists of 24 long triangles called points or pips. The triangles alternate in color and are divided into four quadrants of six triangles each. The four quadrants are the player’s home board and outer board, and the opponent’s home board and outer board. The home boards and outer boards are separated by a divider down the middle referred to as the bar. The starting positions of the pieces are arranged as shown below.
                    </p>

                    <img className="imageStyle" src="https://cdn.shopify.com/s/files/1/0876/1176/files/htp-bg-Backgammon-Board.gif" />

                    <p>
                        The points are numbered starting at 24 in the opponent’s home board and ending at 1 in the player’s own home board.

                        The objective of the game is to move all of one’s own checkers to the home board and then remove (bear off) the pieces from the board entirely. The players move their checkers in opposing direction following a horseshoe path as illustrated.
                    </p>
                    <img className="imageStyle" src="https://cdn.shopify.com/s/files/1/0876/1176/files/htp-bg-Backgammon-Movement-White.gif" />
                    <div>

                    </div>
                    <img className="imageStyle" src="https://cdn.shopify.com/s/files/1/0876/1176/files/htp-bg-Backgammon-Movement-Black.gif" />
                    <span className="littleHeader">
                        Gameplay
                    </span>
                    <p>To start the game, each player rolls a single die and the player with the higher number moves first using both numbers rolled. If both players roll the same number, the dice are rolled again until they roll different numbers. The players then alternate turns, rolling two dice at the beginning of each turn. The dice must always be rolled together and land flat on the right hand side of the game board. If it lands outside or on a checker the dice must be rolled again.</p>
                    <span className="littleHeader">
                        Moving
                    </span>
                    <p>
                        <ul>
                            <li>
                                The dice roll determines how many points the player is supposed to move its checker. The checker always moves forward following the horseshoe path towards the player’s home board.
                            </li>
                            <li>
                                A point that is not occupied by two or more opposing checkers is an open point. When moving a checker it may land only on an open point.
                            </li>
                            <li>
                                The two dice constitute two separate movements. For example, if a player rolls a 6 and a 4, he may move one checker 6 spaces to an open point and another checker 4 spaces to an open point.
                                Backgammon Checker Roll Movement 2
                                <img className="imageStyle" src="https://cdn.shopify.com/s/files/1/0876/1176/files/htp-bg-Backgammon-Roll-Movement-2.gif" />

                            </li>
                            <li>
                                The player may also choose to move the same checker twice, as long as each move is on to an open point.
                                <img className="imageStyle" src="https://cdn.shopify.com/s/files/1/0876/1176/files/htp-bg-Backgammon-Roll-Movement-1.gif" />
                            </li>
                            <li>
                                When a double is rolled the numbers on the dice are played twice. For example, if a player rolls two fives, he may move his checkers five points, four times in any combination landing on open points.
                            </li>
                            <li>
                                A player must move both numbers rolled if possible (four numbers if a double is rolled). If only one of the numbers can be played because only one open point is available, the player must play that number. If either number can be played but not both, then the larger number must be played. If neither number can be played then the player loses his turn. If a player cannot play all four numbers in the case of a double, the player must play as many numbers as possible.
                            </li>
                        </ul>
                        <span className="littleHeader">
                            Hitting
                        </span>
                        <p>
                            An open point containing one opposing checker is a blot. When a checker is moved onto a blot, the blot is hit, and the opposing checker that has been hit is placed on the bar.

                            When a player has one or more checkers on the bar he must first re-enter them onto the opponent’s home board. A checker enters by rolling two dice and moving it to the corresponding point of one of the numbers on the opponent’s home board.
                        </p>
                        <img className="imageStyle" src="https://cdn.shopify.com/s/files/1/0876/1176/files/htp-bg-Backgammon-Enter.gif" />
                        <p>
                            If the checker(s) on the bar cannot enter into an open point, the player loses his turn and the checker(s) remains on the bar. A player cannot move any other piece until all his checkers are off the bar. If a player is able to enter some but not all of his checkers off the bar, his turn is finished. If a player’s checker(s) have been moved off the bar, any unused number must be played.
                        </p>
                        <span className="littleHeader">
                            Outing
                        </span>
                        <p>
                            When all of a player’s checkers are in his home board, he can begin a process of removing them called bearing off. This is done by rolling a number corresponding to a point with a checker residing on it.

                            If no checker can bear off with the number(s) rolled, the player must make a legal move(s) with a checker(s) from a higher point.
                        </p>
                        <img className="imageStyle" src="https://cdn.shopify.com/s/files/1/0876/1176/files/htp-bg-Backgammon-Bear-Off-1.gif" />
                        <span className="littleHeader">
                            Doubling
                        </span>
                        <p>
                            A doubling cube is used to increase the stakes at any point in the game. At the start of the game, the doubling cube is placed on the bar with 64 facing upwards. Before the roll on a player’s turn, that player may propose to double the current stakes. The opponent either accepts (takes) the doubled stakes or resigns (drops) and loses the match and the current stakes. If the opponent takes he becomes the owner of the cube and the cube is turned over so that 2 is facing upwards. Thereafter only the owner of the cube has the right to propose to double the stakes again (redouble). If the opponent takes, the ownership of the cube is passed over to him and this process can continue on from 4 to 8 and onwards. There are no limits to redoubles even though the highest number on the cube is 64.
                        </p>
                        <span className="littleHeader">
                            Gammon and Backgammon
                        </span>
                        <p>
                            At the end of the game, if a person has borne off all fifteen of his checkers and the opponent has borne off at least one checker, that person wins the current stake. If the opponent has not borne off any checkers, then the opponent loses a gammon and loses double the current stakes. If the opponent has not borne off any checkers and still has one or more checkers on the bar, the opponent loses a backgammon and loses triple the current stakes
                        </p>
                    </p>
                </div>
            </main>
        </div>
    )
}
export default About;