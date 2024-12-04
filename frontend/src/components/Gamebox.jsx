import { useState, useEffect, useRef } from 'react';
import Boxes from './Boxes';
import Defeat from './resultsScreens/Defeat';
import Win from './resultsScreens/win';

function Gamebox() {
    const [WORD, setWord] = useState(''); 
    const [life, setLife] = useState(5); 
    const hasFetched = useRef(false); 

    useEffect(() => {
        if (!hasFetched.current) {
            fetchData();
            hasFetched.current = true; 
        }
    }, []);

    
    async function fetchData(index = null) {
        const URL = 'http://localhost:8081/data';

        try {
            const response = await fetch(URL);
            const data = await response.json();

            const selectedWord =
                index !== null && index >= 0 && index < data.length
                    ? data[index]
                    : data[Math.floor(Math.random() * data.length)];

            setWord(selectedWord); 
        } catch (error) {
            console.error('Error fetching wordlist:', error);
        }
    }

    async function incrementStreak() {
        const URL = 'http://localhost:8081/increment-streak';

        try {
            const response = await fetch(URL, {
                method: 'POST',
                credentials: 'include', 
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

async function resetStreak() {
    const URL = 'http://localhost:8081/reset-streak';

    try {
        const response = await fetch(URL, {
            method: 'POST',
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lost: true }), 
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


    function disableBoxRow(nodes) {
        nodes.forEach((node) => {
            node.setAttribute('contentEditable', 'false');
            node.classList.remove('text-cursor');
            node.classList.add('locked-cursor');
        });
    }

    function monitor(data) {
        return data !== null;
    }

    const checkCorrectLetters = (rowData) => {
        let resultsObject = [];
        let resultsIndex = [1, 1, 1, 1, 1]; 

        rowData.forEach((data, id) => {
            if (data === WORD[id]) {
                resultsObject.push({ letter: WORD[id], position: id });
                resultsIndex[id] = 0; 
            }
        });

        return checkMisplacedLetters(rowData, resultsObject, resultsIndex);
    };

    const checkMisplacedLetters = (dataRow, matchedInfo, resultsIndex) => {
        let cachedWord = WORD;

        matchedInfo.forEach((data) => {
            cachedWord = cachedWord.replace(data.letter, '#');
        });

        dataRow.forEach((data, id) => {
            if (cachedWord.includes(data)) {
                resultsIndex[id] = 2; 
                cachedWord = cachedWord.replace(data, '#');
            }
        });

        return resultsIndex;
    };

    function checkInputs(rowData, nodeData) {
        console.log(WORD); 
        disableBoxRow(nodeData);
        const results = checkCorrectLetters(rowData);

        nodeData.forEach((node, id) => {
            if (results[id] === 0) {
                node.classList.add('background-green'); 
            } else if (results[id] === 2) {
                node.classList.add('background-yellow'); 
            }
        });

        let winstatus = 369; 
        results.forEach((num) => (winstatus += num));

        if (winstatus === 369) {
            setLife(1000); 
        } else {
            setLife(life - 1); 
        }
    }

    useEffect(() => {
        if (life === 1000) {
            incrementStreak();
        } else if (life === 0) {
            resetStreak();
        }
    }, [life]);
    

    const lifeOne = document.querySelectorAll('.box0');
    const lifeTwo = document.querySelectorAll('.box1');
    const lifeThree = document.querySelectorAll('.box2');
    const lifeFour = document.querySelectorAll('.box3');
    const lifeFive = document.querySelectorAll('.box4');

    const lifeMatrix = [lifeOne, lifeTwo, lifeThree, lifeFour, lifeFive];
    const lifeData = { one: [], two: [], three: [], four: [], five: [] };

    if (lifeOne[0]) lifeOne[0].focus();

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
