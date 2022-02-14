import React, { useState, useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdPhotoSizeSelectActual, MdDeleteSweep } from 'react-icons/md';
import { AiFillPlusCircle } from 'react-icons/ai';

import Navigation from '../../components/NavigationBar/NavigationBar';
import PostModal from '../../components/Post/PostModal';
import NoImage from '../../images/NoImage.png';
import Feed from '../../components/Feed/Feed';

import styles from './ProfilePage.module.css';

const URL_REQUEST = 'http://localhost:3004/';

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);

  let location = useLocation();
  const navigation = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const getUserData = fetch(
      URL_REQUEST + `users_data/${location.state}`
    ).then((response) => response.json());
    Promise.all([getUserData]).then(([user]) => {
      setUser({ ...user, posts: user.posts.reverse() });
    });
  };

  const closeModal = () => {
    setShowModal((prevState) => !prevState);
  };

  const sendPost = (text) => {
    let posts = [...user.posts, { post: text, dateTime: getCurrentTime() }];
    let newUser = { ...user, posts: posts.reverse() };
    fetch(URL_REQUEST + `users_data/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    }).then((response) => {
      if (response.ok) {
        closeModal();
        setUser(newUser);
      }
    });
  };

  const getCurrentTime = () => {
    let date = new Date();
    let dateAndTime =
      date.getHours() +
      ':' +
      date.getMinutes() +
      ' ' +
      date.toLocaleDateString();
    return dateAndTime;
  };

  const deletePost = (position) => {
    let postID = user.posts.length - 1 - position;
    let posts = [...user.posts];
    if (posts.length === 1) posts = [];
    posts.splice(postID, 1);
    let newUser = { ...user, posts: posts };
    fetch(URL_REQUEST + `users_data/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    }).then(() => setUser(newUser));
  };

  const setUserStatus = (status) => {
    fetch(URL_REQUEST + `users_data/${location.state}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...user, online: status }),
    });
  };

  const logOut = () => {
    Promise.all([setUserStatus(false)]).then(() => {
      localStorage.clear();
      document.cookie = false;
      navigation('/', { replace: true });
    });
  };

  return (
    <Scrollbars style={{ width: '100vw', height: '100vh' }}>
      <div className={styles.Parent}>
        <Navigation logout={logOut} />
        <PostModal
          show={showModal}
          closeModal={closeModal}
          sendPost={(text) => sendPost(text)}
        />
        <div className={styles.WelcomeSection}>
          <img
            className={styles.ProfileImage}
            src={
              user.images !== undefined && user.images.length > 0
                ? user.images[0]
                : NoImage
            }
            alt=''
          />
        </div>

        <div className={styles.UserName}>
          {user.firstName}&nbsp;{user.lastName}
        </div>

        <div className={styles.PostsArea}>
          <div className={styles.Posts}>
            <div className={styles.postsHeader}>
              {user.id === Number(localStorage.getItem('CurrentUserID')) && (
                <div className={styles.addNewPostHeader}>
                  <AiFillPlusCircle
                    className={styles.addPostsIcon}
                    onClick={() => setShowModal((prevState) => !prevState)}
                  />
                  <h6 className={styles.addPostTitle}>Add new post</h6>
                </div>
              )}
              <div className={styles.addNewPostHeader}>
                <Link className={styles.PhotosButton} to='/photos' state={user}>
                  <MdPhotoSizeSelectActual className={styles.photosIcon} />
                  <h6 className={styles.photosTitle}>Photos</h6>
                </Link>
              </div>
            </div>
            <hr className={styles.headerLine} />
            <h3 className={styles.postsTitle}>Recent posts</h3>
            <Scrollbars style={{ width: '100%', height: '100%' }}>
              {user.posts?.map((item, key) => (
                <div key={key} className={styles.postContainer}>
                  {user.id ===
                    Number(localStorage.getItem('CurrentUserID')) && (
                    <MdDeleteSweep
                      className={styles.deleteButton}
                      onClick={() => deletePost(key)}
                    />
                  )}

                  <Feed
                    post={item.post}
                    dateAndTime={item.dateTime}
                    user={{
                      firstName: user.firstName,
                      lastName: user.lastName,
                    }}
                  />
                </div>
              ))}
              {user.posts?.length === 0 && (
                <p className={styles.NoPostsText}>There are no posts</p>
              )}
            </Scrollbars>
          </div>
          <div className={styles.PhotosContainer}>
            <div className={styles.photosLinkButton}>
              <Link
                to='/photos'
                className={styles.photosLinkStyle}
                state={user}
              >
                Photos
              </Link>
            </div>
            <hr className={styles.headerLine} />
            <Scrollbars>
              <div className={styles.Photos}>
                {user.images !== undefined &&
                  user.images.map((image, key) => (
                    <img
                      className={styles.image}
                      key={key}
                      src={image}
                      alt='img'
                    />
                  ))}
              </div>
              {(user.images !== undefined && user.images.length) === 0 && (
                <p className={styles.NoPostsText}>No photos</p>
              )}
            </Scrollbars>
          </div>
        </div>
      </div>
    </Scrollbars>
  );
}
