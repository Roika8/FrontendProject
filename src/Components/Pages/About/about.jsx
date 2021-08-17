import React from 'react'
import './about.css'
const About = () => {
    return (
        < main id="wrapper">
            <div className="contentHeader">
                <h1 class="page-title">How to Play Backgammon</h1>
                <span className="miniHeader">
                    Backgammon is one of the oldest board games with origins dating as far back as 3000 BC. It is a game of luck and strategy and popular around the world. Easy to learn and fun to play, it is no wonder why it has withstood the test of time and is played by so many people.
                </span>
                <span className="littleHeader">
                    Equipment
                </span>
                <p>
                    he game is played by two players each, with fifteen checkers of his own color.

                    Each player also has their own pair of dice and dice cup.

                    A doubling cube with the numbers 2, 4, 8, 16, 32, 64 is used for tracking the stakes of the round.

                    The board consists of 24 long triangles called points or pips. The triangles alternate in color and are divided into four quadrants of six triangles each. The four quadrants are the player’s home board and outer board, and the opponent’s home board and outer board. The home boards and outer boards are separated by a divider down the middle referred to as the bar. The starting positions of the pieces are arranged as shown below.
                </p>

                <div> Image</div>

                <p>
                    The points are numbered starting at 24 in the opponent’s home board and ending at 1 in the player’s own home board.

                    The objective of the game is to move all of one’s own checkers to the home board and then remove (bear off) the pieces from the board entirely. The players move their checkers in opposing direction following a horseshoe path as illustrated.
                </p>
                <div>IMage</div>
                <div>IMage</div>
                <span className="littleHeader">
                    Gameplay
                </span>
                <p>To start the game, each player rolls a single die and the player with the higher number moves first using both numbers rolled. If both players roll the same number, the dice are rolled again until they roll different numbers. The players then alternate turns, rolling two dice at the beginning of each turn. The dice must always be rolled together and land flat on the right hand side of the game board. If it lands outside or on a checker the dice must be rolled again.</p>
                <span className="littleHeader">
                    Moving
                </span>
                <p>
                The dice roll determines how many points the player is supposed to move its checker. The checker always moves forward following the horseshoe path towards the player’s home board.
A point that is not occupied by two or more opposing checkers is an open point. When moving a checker it may land only on an open point.
The two dice constitute two separate movements. For example, if a player rolls a 6 and a 4, he may move one checker 6 spaces to an open point and another checker 4 spaces to an open point.

Backgammon Checker Roll Movement 2



The player may also choose to move the same checker twice, as long as each move is on to an open point.

Backgammon Checker Roll Movement 1



When a double is rolled the numbers on the dice are played twice. For example, if a player rolls two fives, he may move his checkers five points, four times in any combination landing on open points.
A player must move both numbers rolled if possible (four numbers if a double is rolled). If only one of the numbers can be played because only one open point is available, the player must play that number. If either number can be played but not both, then the larger number must be played. If neither number can be played then the player loses his turn. If a player cannot play all four numbers in the case of a double, the player must play as many numbers as possible.
                </p>
            </div>
        </main>
    )
}
export default About;