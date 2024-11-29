import { useState, useEffect, useRef } from 'react';
import Boxes from './Boxes';
import Defeat from './resultsScreens/Defeat';
import Win from './resultsScreens/win';

function Gamebox() {
    const [WORD, setWord] = useState(''); // State for the selected word
    const [life, setLife] = useState(5); // State for player's lives
    const hasFetched = useRef(false); // To prevent multiple fetches

    // Fetch wordlist data on component mount
    useEffect(() => {
        if (!hasFetched.current) {
            fetchData();
            hasFetched.current = true; // Mark fetch as completed
        }
    }, []);

    // Function to fetch wordlist data
    async function fetchData(index = null) {
        const URL = 'http://localhost:8081/data';

        try {
            const response = await fetch(URL);
            const data = await response.json();

            // Select a word: use provided index or pick a random word
            const selectedWord =
                index !== null && index >= 0 && index < data.length
                    ? data[index]
                    : data[Math.floor(Math.random() * data.length)];

            setWord(selectedWord); // Update state with the fetched word
        } catch (error) {
            console.error('Error fetching wordlist:', error);
        }
    }

    // Function to update the streak
    async function incrementStreak() {
        const URL = 'http://localhost:8081/increment-streak';

        try {
            const response = await fetch(URL, {
                method: 'POST',
                credentials: 'include', // Include cookies for session
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                console.log('Streak incremented successfully:', result.newStreak);
            } else {
                console.error('Failed to increment streak:', result.message);
            }
        } catch (error) {
            console.error('Error incrementing streak:', error);
        }
    }

    // Function to reset the streak
async function resetStreak() {
    const URL = 'http://localhost:8081/reset-streak';

    try {
        const response = await fetch(URL, {
            method: 'POST',
            credentials: 'include', // Include cookies for session
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lost: true }), // Indicate the game is lost
        });

        const result = await response.json();

        if (result.success) {
            console.log('Streak reset successfully');
        } else {
            console.error('Failed to reset streak:', result.message);
        }
    } catch (error) {
        console.error('Error resetting streak:', error);
    }
}


    // Disable inputs for a specific row
    function disableBoxRow(nodes) {
        nodes.forEach((node) => {
            node.setAttribute('contentEditable', 'false');
            node.classList.remove('text-cursor');
            node.classList.add('locked-cursor');
        });
    }

    // Prevent action on null input (e.g., backspace)
    function monitor(data) {
        return data !== null;
    }

    // Check correct letters
    const checkCorrectLetters = (rowData) => {
        let resultsObject = [];
        let resultsIndex = [1, 1, 1, 1, 1]; // Default state: all incorrect

        rowData.forEach((data, id) => {
            if (data === WORD[id]) {
                resultsObject.push({ letter: WORD[id], position: id });
                resultsIndex[id] = 0; // Correct position
            }
        });

        return checkMisplacedLetters(rowData, resultsObject, resultsIndex);
    };

    // Check misplaced letters
    const checkMisplacedLetters = (dataRow, matchedInfo, resultsIndex) => {
        let cachedWord = WORD;

        // Remove matched letters from cached word
        matchedInfo.forEach((data) => {
            cachedWord = cachedWord.replace(data.letter, '#');
        });

        // Check for misplaced letters
        dataRow.forEach((data, id) => {
            if (cachedWord.includes(data)) {
                resultsIndex[id] = 2; // Misplaced
                cachedWord = cachedWord.replace(data, '#');
            }
        });

        return resultsIndex;
    };

    // Check input results and apply styles
    function checkInputs(rowData, nodeData) {
        console.log(WORD); // Debug: log the word
        disableBoxRow(nodeData);
        const results = checkCorrectLetters(rowData);

        nodeData.forEach((node, id) => {
            if (results[id] === 0) {
                node.classList.add('background-green'); // Correct
            } else if (results[id] === 2) {
                node.classList.add('background-yellow'); // Misplaced
            }
        });

        // Determine game status
        let winstatus = 369; // Fun status value
        results.forEach((num) => (winstatus += num));

        if (winstatus === 369) {
            setLife(1000); // Player wins
        } else {
            setLife(life - 1); // Deduct a life
        }
    }

    useEffect(() => {
        if (life === 1000) {
            // Player won the game, increment the streak
            incrementStreak();
        } else if (life === 0) {
            // Player lost the game, reset the streak
            resetStreak();
        }
    }, [life]);
    

    // Game setup: define rows and event handlers
    const lifeOne = document.querySelectorAll('.box0');
    const lifeTwo = document.querySelectorAll('.box1');
    const lifeThree = document.querySelectorAll('.box2');
    const lifeFour = document.querySelectorAll('.box3');
    const lifeFive = document.querySelectorAll('.box4');

    const lifeMatrix = [lifeOne, lifeTwo, lifeThree, lifeFour, lifeFive];
    const lifeData = { one: [], two: [], three: [], four: [], five: [] };

    // Focus on the first input box
    if (lifeOne[0]) lifeOne[0].focus();

    // Set up event listeners for input boxes
    lifeMatrix.forEach((data, mid) => {
        let handler;
        if (mid === 0) handler = lifeData.one;
        else if (mid === 1) handler = lifeData.two;
        else if (mid === 2) handler = lifeData.three;
        else if (mid === 3) handler = lifeData.four;
        else if (mid === 4) handler = lifeData.five;

        data.forEach((box, id, array) => {
            if (id === array.length - 1) {
                box.addEventListener('input', (e) => {
                    if (monitor(e.data)) handler.push(e.data);
                    checkInputs(handler, data);
                    if (lifeMatrix[mid + 1]) lifeMatrix[mid + 1][0].focus();
                });
            } else {
                box.addEventListener('input', (e) => {
                    if (monitor(e.data)) handler.push(e.data);
                    data[id + 1].focus();
                });
            }
        });
    });

    // Render the game UI
    return (
        <div className="game-box">
            {life === 0 ? (
                <Defeat word={WORD} />
            ) : life === 1000 ? (
                <Win />
            ) : (
                <>
                    <h2 className="mb-5">You only have {life} lives</h2>
                    <Boxes lives="5" />
                </>
            )}
        </div>
    );
}

export default Gamebox;
