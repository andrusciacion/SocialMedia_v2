import React, { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import Scrollbars from 'react-custom-scrollbars-2';
import Navigation from '../../components/NavigationBar/NavigationBar';
import PostModal from '../../components/PostModal';
import NoImage from '../../images/NoImage.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdPhotoSizeSelectActual, MdDeleteSweep } from 'react-icons/md';
import { AiFillPlusCircle } from 'react-icons/ai';
import Feed from '../../components/Feed/Feed';

const URL_REQUEST = 'http://localhost:3004/';

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);

  let location = useLocation();
  const navigation = useNavigate();

  useEffect(() => {
    getFriend(location.state);
  }, []);

  useEffect(() => {
    getPosts();
  }, [user]);

  const getPosts = async () => {
    setPosts([]);
    user.posts.forEach(async () => {
      await fetch(URL_REQUEST + `users_data/${user.id}`)
        .then((response) => response.json())
        .then((data) => setPosts(data.posts.reverse()));
    });
  };

  const getFriend = (friend) => {
    if (!isNaN(friend)) {
      getUser(friend);
    }
  };

  const getUser = async (friendID) => {
    let id = localStorage.getItem('CurrentUserID');
    if (!isNaN(friendID)) id = friendID;
    await fetch(URL_REQUEST + `users_data/${id}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .then(() => getPosts());
  };

  const closeModal = () => {
    setShowModal((prevState) => !prevState);
    getFriend(user);
  };

  const sendPost = async (text) => {
    let posts = [...user.posts, { post: text, dateTime: getCurrentTime() }];
    let newUser = { ...user, posts: posts };
    await fetch(URL_REQUEST + `users_data/${user.id}`, {
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

  const setUserStatus = async (status) => {
    fetch(URL_REQUEST + `users_data/${this.state.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...this.state.user, online: status }),
    });
  };

  const logOut = () => {
    setUserStatus(false, user).then(() => {
      localStorage.clear();
      navigation('/', { replace: true });
    });
  };

  const deletePost = async (position) => {
    let postID = user.posts.length - 1 - position;
    let posts = [...user.posts];
    if (posts.length === 1) posts = [];
    posts.splice(postID, 1);
    let newUser = { ...user, posts: posts };
    await fetch(URL_REQUEST + `users_data/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    }).then(() => setUser(newUser));
  };

  const deleteFriend = () => {};

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
          {/* <img className={styles.BackgroundImage} src={Background} alt='' /> */}
          {/* {user.id != localStorage.getItem('CurrentUserID') && (
            <button
              style={{
                position: 'absolute',
                right: 0,
                marginRight: 50,
                marginTop: 15,
                padding: 5,
                fontWeight: 'bold',
                borderRadius: 10,
                border: 'none',
                boxShadow: '0px 0px 8px 3px rgba(34, 60, 80, 0.5)',
                backgroundColor: 'rgba(255, 0,0,0.8)',
                color: 'white',
              }}
              onClick={deleteFriend}
            >
              Delete from friends
            </button>
          )} */}
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
          {user.firstName + ' ' + user.lastName}
        </div>

        <div className={styles.PostsArea}>
          <div className={styles.Posts}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: -10,
                width: '90%',
                justifyContent: 'space-around',
              }}
            >
              {user.id == localStorage.getItem('CurrentUserID') && (
                <div style={{ display: 'flex' }}>
                  <AiFillPlusCircle
                    style={{
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 30,
                      marginLeft: 20,
                      marginTop: 10,
                      marginRight: 10,
                    }}
                    onClick={() => setShowModal((prevState) => !prevState)}
                  />
                  <h6 style={{ marginTop: 15 }}>Add new post</h6>
                </div>
              )}

              <Link
                className={styles.PhotosButton}
                to='/photos'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'black',
                }}
              >
                <MdPhotoSizeSelectActual
                  style={{
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 30,
                    marginLeft: 20,
                    marginTop: 10,
                    marginRight: 10,
                  }}
                />
                <h6 style={{ marginTop: 20 }}>Photos</h6>
              </Link>
            </div>
            <hr
              style={{
                height: 3,
                color: 'white',
                width: '96%',
                marginInline: 'auto',
              }}
            />
            <h3
              style={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              Recent posts
            </h3>
            <Scrollbars style={{ width: '100%', height: '80%' }}>
              {posts.map((item, key) => (
                <div
                  key={key}
                  style={{
                    width: '80%',
                    marginInline: 'auto',

                    justifyContent: 'flex-end',
                  }}
                >
                  {user.id == localStorage.getItem('CurrentUserID') && (
                    <MdDeleteSweep
                      style={{
                        fontSize: 30,
                        position: 'absolute',
                        marginLeft: '69%',
                        marginTop: 10,
                        cursor: 'pointer',
                      }}
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
              {posts.length === 0 && (
                <p className={styles.NoPostsText}>There are no posts</p>
              )}
            </Scrollbars>
          </div>

          <div className={styles.PhotosContainer}>
            <Link to='/photos' style={PhotosLinkStyle} state={user}>
              Photos
            </Link>
            <hr
              style={{
                color: 'white',
                height: 3,
                marginTop: 9,
                width: '95%',
                marginInline: 'auto',
              }}
            />
            <Scrollbars
              style={{
                height: '100%',
              }}
            >
              <div className={styles.Photos}>
                {user.images !== undefined &&
                  user.images.map((image) => (
                    <img
                      src={image}
                      alt='img'
                      style={{
                        boxShadow: '0px 0px 8px 5px rgba(34, 60, 80, 0.5)',
                        borderRadius: 10,
                      }}
                    />
                  ))}
              </div>
              {(user.images !== undefined && user.images.length) === 0 && (
                <p
                  className={styles.NoPostsText}
                  style={{ marginInline: 'auto', display: 'flex' }}
                >
                  No photos
                </p>
              )}
            </Scrollbars>
          </div>
        </div>
      </div>
    </Scrollbars>
  );
}

const PhotosLinkStyle = {
  marginLeft: 20,
  textDecoration: 'none',
  color: 'black',
  fontSize: 30,
  width: '100%',
  fontWeight: 'bold',
  cursor: 'pointer',
  borderRadius: 10,
  textShadow: '2px 2px rgba(0,0,0,0.3)',
  padding: '5px',
};
