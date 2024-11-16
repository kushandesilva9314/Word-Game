import React from 'react';
import {Container} from 'react-bootstrap';
import Gamebox from './components/Gamebox';



const game = () => {
    return(
    <Container>
    <h1 className='text-center my-5 underline-bottom'>Word Guesser</h1>
    <div className='text-center'>
      <Gamebox/>

    </div>
  </Container>
    )
};

export default game;