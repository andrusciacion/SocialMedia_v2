import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import styles from './PostModal.module.css';

export default function ModalBox(props) {
  const [postText, setPostText] = useState('');
  const [error, displayError] = useState(false);

  const handleSubmit = () => {
    let text = postText.trim();
    if (text !== '') {
      displayError(false);
      props.sendPost(text);
    } else {
      displayError(true);
    }
  };

  const onClick = () => {
    setPostText('');
    props.closeModal();
  };

  const onChangeText = (text) => {
    displayError(false);
    setPostText(text);
  };
  return (
    <Modal show={props.show}>
      <Modal.Header closeButton onClick={onClick}>
        <Modal.Title>Add a new post</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <textarea
          className={styles.postText}
          placeholder='Type here...'
          onChange={(input) => onChangeText(input.target.value)}
          required
        ></textarea>
      </Modal.Body>
      <Modal.Footer>
        {error && <p>Add some text</p>}
        <Button type='submit' variant='primary' onClick={() => handleSubmit()}>
          Post
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
