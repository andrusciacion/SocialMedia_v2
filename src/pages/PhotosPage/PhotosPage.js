import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Navigate, useLocation } from 'react-router-dom';

import Navigation from '../../components/NavigationBar/NavigationBar';
import ZoomImages from '../../components/Zoom/Zoom';

import styles from './PhotosPage.module.css';

const URL = 'http://localhost:3004/users_data/';

export default function PhotosPage() {
  const [user, setUser] = useState('');
  const [zoom, setZoom] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [logOut, setLogOut] = useState(false);

  let location = useLocation();

  useEffect(() => {
    Promise.all([getUserData()]).then(([data]) => setUser(data));
  }, []);

  const getUserData = () =>
    fetch(URL + `${location.state.id}`).then((response) => response.json());

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
        {user.images?.length === 0 && (
          <div className={styles.noPhotos}>There are no images</div>
        )}
        <Scrollbars>
          <div className={styles.ImageGallery}>
            {user !== '' &&
              user.images.map((image, index) => (
                <img
                  className={styles.image}
                  key={index}
                  src={image}
                  alt=''
                  onClick={() => zoomImage(index)}
                />
              ))}
          </div>
        </Scrollbars>
      </div>
    </>
  );
}
