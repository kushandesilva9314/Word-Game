import React from 'react'
import {Container} from 'react-bootstrap'

//6 chances
//5 letter words
function Boxes({lives}) {
    const lifeCount=Array.from(Array(parseInt(lives)).keys());
  return (
      <>
      {lifeCount.map((i)=>(
          
            <Container className='d-flex d-row justify-content-center' key={i}>
            <div className={'input-box text-cursor box'+i} contentEditable='true'></div>
              <div className={'input-box text-cursor box'+i} contentEditable='true'></div>
              <div className={'input-box text-cursor box'+i} contentEditable='true'></div>
              <div className={'input-box text-cursor box'+i} contentEditable='true'></div>
              <div className={'input-box text-cursor box'+i} contentEditable='true'></div>
            </Container>
          ))}
      </>
  )
}

export default Boxes
