import React, { useState } from 'react';
import styles from './Navigation.module.css';
import { TiSocialFlickrCircular } from 'react-icons/ti';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { Button, Modal } from 'react-bootstrap';

export default function NavigationBar(props) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(!showModal);

  return (
    <div className={styles.Parent}>
      <Modal show={showModal} style={{ marginTop: '10vh' }}>
        <Modal.Header closeButton onClick={handleShow}>
          <Modal.Title>Do you want to log out?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <div
            style={{
              display: 'flex',
              width: '100%',
            }}
          >
            <Button
              style={{
                alignSelf: 'center',
                marginInline: 'auto',
                width: '30%',
              }}
              type='submit'
              variant='danger'
              onClick={props.logout}
            >
              Yes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Link className={styles.Logo} to='/home' state={props.user}>
        <TiSocialFlickrCircular style={{ color: 'white', fontSize: 40 }} />
      </Link>
      <button className={styles.LogOutButton} onClick={handleShow}>
        <FiLogOut />
      </button>
    </div>
  );
}
