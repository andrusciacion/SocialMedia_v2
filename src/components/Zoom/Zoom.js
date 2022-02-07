import React, { useEffect, useState } from 'react';
import styles from './Zoom.module.css';
import {
  AiOutlineClose,
  AiFillCaretLeft,
  AiFillCaretRight,
} from 'react-icons/ai';

export default function ZoomImages(props) {
  const [position, setPosition] = useState({
    X: 0,
    Y: 0,
  });
  const [index, setIndex] = useState(0);

  const updatePosition = (event) => {
    const { pageX, pageY, clientX, clientY } = event;

    setPosition({
      clientX,
      clientY,
    });
  };

  useEffect(() => {
    document.addEventListener('mousemove', updatePosition, false);
    document.addEventListener('mouseenter', updatePosition, false);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseenter', updatePosition);
    };
  }, []);

  useEffect(() => {
    setIndex(props.index);
  }, [props]);

  const goLeft = () => {
    if (index !== 0) {
      console.log('left');
      setIndex((prevState) => prevState - 1);
    }
  };

  const goRight = () => {
    if (index < props.images.length - 1) {
      console.log('right');
      setIndex((prevState) => prevState + 1);
    }
  };

  return (
    <div className={styles.Parent}>
      <header className={styles.Header} onClick={props.closeZoom}>
        <AiOutlineClose
          style={{
            color: 'white',
            fontSize: 30,
          }}
        />
      </header>
      <div className={styles.ImageBox}>
        <div
          className={styles.CustomCursor}
          id='cursor'
          style={{
            left: position.clientX,
            top: position.clientY,
          }}
        >
          {position.clientX < window.innerWidth / 2 ? (
            <AiFillCaretLeft
              style={{ color: 'white', fontSize: 40 }}
              onClick={() => goLeft()}
            />
          ) : (
            <AiFillCaretRight
              style={{ color: 'white', fontSize: 40 }}
              onClick={() => goRight()}
            />
          )}
        </div>
        <img src={props.images[index]} alt='' />
      </div>
      <div style={{ color: 'white', marginBottom: 20, fontWeight: 'bold' }}>{`${
        index + 1
      } / ${props.images.length}`}</div>
    </div>
  );
}
