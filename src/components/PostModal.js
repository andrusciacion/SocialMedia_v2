import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

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
    <Modal show={props.show} style={{ marginTop: '10vh' }}>
      <Modal.Header closeButton onClick={onClick}>
        <Modal.Title>Add a new post</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: 150 }}>
        <textarea
          style={style}
          placeholder='Type here...'
          onChange={(input) => onChangeText(input.target.value)}
          required
        ></textarea>
      </Modal.Body>
      <Modal.Footer>
        <p style={{ visibility: error ? 'visible' : 'hidden' }}>
          Add some text
        </p>
        <Button type='submit' variant='primary' onClick={() => handleSubmit()}>
          Post
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const style = {
  width: '105%',
  height: '100%',
  marginTop: -10,
  marginBottom: -15,
  border: 'none',
  marginLeft: -12,
  outline: 'none',
};
