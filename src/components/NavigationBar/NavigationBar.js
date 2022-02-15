import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { FiLogOut } from 'react-icons/fi';
import { TiSocialFlickrCircular } from 'react-icons/ti';

import styles from './NavigationBar.module.css';

export default function NavigationBar(props) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(!showModal);

  return (
    <div className={styles.Parent}>
      <Modal show={showModal}>
        <Modal.Header closeButton onClick={handleShow}>
          <Modal.Title>Do you want to log out?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <div className={styles.modalFooter}>
            <Button
              className={styles.buttonFooter}
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
        <TiSocialFlickrCircular />
      </Link>
      <button className={styles.LogOutButton} onClick={handleShow}>
        <FiLogOut />
      </button>
    </div>
  );
}
