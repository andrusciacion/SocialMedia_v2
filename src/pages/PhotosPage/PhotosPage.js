import React, { useEffect, useState } from 'react';
import styles from './PhotosPage.module.css';
import Navigation from '../../components/NavigationBar/NavigationBar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import ZoomImages from '../../components/Zoom/Zoom';
import { Navigate } from 'react-router-dom';

const URL = 'http://localhost:3004/users_data/';

export default function PhotosPage(props) {
  const [user, setUser] = useState('');
  const [zoom, setZoom] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [logOut, setLogOut] = useState(false);

  useEffect(() => {
    getUserData();
  }, [props]);

  const getUserData = async () => {
    await fetch(URL + `${localStorage.getItem('CurrentUserID')}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => setUser(data));
  };

  const zoomImage = (index) => {
    setImageIndex(index);
    setZoom(true);
  };

  const closeZoom = () => {
    setZoom(false);
  };

  const setUserStatus = (status) => {
    fetch(URL + `/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...user, online: status }),
    });
  };

  if (logOut) {
    setUserStatus(false);
    return <Navigate to='/' />;
  }
  return (
    <>
      {zoom && (
        <ZoomImages
          images={user.images}
          index={imageIndex}
          closeZoom={() => closeZoom()}
        />
      )}
      <Navigation logout={() => setLogOut(true)} />
      <div className={styles.Parent}>
        <div className={styles.Title}>Image Gallery</div>
        <Scrollbars>
          <div className={styles.ImageGallery}>
            {user !== '' &&
              user.images.map((image, index) => (
                <img src={image} onClick={() => zoomImage(index)} />
              ))}
          </div>
        </Scrollbars>
      </div>
    </>
  );
}
