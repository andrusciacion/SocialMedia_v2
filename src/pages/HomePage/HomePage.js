import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { BsPlusCircle, BsSearch } from 'react-icons/bs';
import { MdPhotoSizeSelectActual } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useFilePicker } from 'use-file-picker';

import Feed from '../../components/Feed/Feed';
import Friends from '../../components/Friends/Friends';
import Navigation from '../../components/NavigationBar/NavigationBar';
import SearchModal from '../../components/Search/SearchModal';
import NoImage from '../../images/NoImage.png';

import styles from './HomePage.module.css';

const URL_REQUEST = 'http://localhost:3004/';

export default function HomePage() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState({
    friendsPosts: [],
    newPosts: [],
    postExist: false,
  });
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [show, setShow] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const navigation = useNavigate();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () => {
    resetState();
    let userData = {};
    let posts = [];
    let id = localStorage.getItem('CurrentUserID');
    Promise.all([setUserStatus(true, id)])
      .then(([user]) => {
        setUser(user);
        Object.assign(userData, user);
      })
      .then(() =>
        Promise.all([getUserFriendsData(userData)]).then(([data]) =>
          data.map((friendData) =>
            Promise.all([friendData])
              .then(([data]) => {
                posts.push(data);
                setFriends((prevState) => [...prevState, data]);
                if (data.online)
                  setOnlineFriends((prevState) => [...prevState, data]);
              })
              .then(() => setPosts({ friendsPosts: sortPosts(posts) }))
          )
        )
      );
  };

  const getUserFriendsData = (user) =>
    user.friends.map((item) =>
      fetch(URL_REQUEST + `users_data/${item}`).then((response) =>
        response.json()
      )
    );

  const sortPosts = (posts) => {
    let newArray = [];
    posts.forEach((item) => {
      item.posts.forEach((second) =>
        newArray.push({
          post: second.post,
          dateTime: second.dateTime,
          firstName: item.firstName,
          lastName: item.lastName,
          image: item.images[item.images.length - 1],
        })
      );
    });
    newArray = newArray.sort(function (a, b) {
      return new Date(b.dateTime) - new Date(a.dateTime);
    });
    return newArray;
  };

  const setUserStatus = (status, id) =>
    fetch(URL_REQUEST + `users_data/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        online: status,
      }),
    }).then((response) => response.json());

  const setImage = (image) => {
    let imagesArray = [...user.images];
    imagesArray.unshift(image);
    let request = fetch(URL_REQUEST + `users_data/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...user,
        images: imagesArray,
      }),
    });
    Promise.all([request]).then(() => getUserData());
  };

  const showModal = () => {
    fetch(URL_REQUEST + 'users_data', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => setAllUsers(data))
      .then(() => setShow((prevState) => !prevState));
  };

  const closeModal = () => {
    setShow((prevState) => !prevState);
    getUserData();
  };

  const logOut = () => {
    setUserStatus(false, user.id).then(() => {
      localStorage.clear();
      document.cookie = false;
      navigation('/', { replace: true });
    });
  };

  const resetState = () => {
    setUser({});
    setFriends([]);
    setOnlineFriends([]);
  };

  return (
    <>
      <Navigation logout={logOut} />
      <SearchModal
        showModal={show}
        closeModal={closeModal}
        users={allUsers}
        user={user}
      />
      <div className={styles.Parent}>
        {posts.postExist && (
          <button className={styles.newPostsButton}>New posts...</button>
        )}

        <div>
          <div className={styles.Profile}>
            <img
              className={styles.image}
              src={
                user.images !== undefined && user.images.length > 0
                  ? user.images[0]
                  : NoImage
              }
              alt=''
            />
            <div className={styles.ProfileImage}>
              <PickImage setImage={(image) => setImage(image)} />
            </div>
          </div>
          <div>
            <Link to='/profile' state={user.id} className={styles.UserName}>
              {user.firstName}&nbsp;{user.lastName}
            </Link>
          </div>
          <div className={styles.ProfileButtons}>
            <Link to='/photos' className={styles.Buttons} state={user}>
              <MdPhotoSizeSelectActual className={styles.photoIcon} />
              Photos
            </Link>
          </div>
          <hr className={styles.postsLine} />
          <div className={styles.friendsHeader}>
            <Link className={styles.link} to='/friends' state={user.friends}>
              <h3 className={styles.friendsTitle}>Friends</h3>
            </Link>

            <button className={styles.searchButton} onClick={showModal}>
              <BsSearch />
            </button>
          </div>

          <div className={styles.Friends}>
            <Scrollbars style={{ height: 200 }}>
              <div className={styles.ListFriends}>
                {friends &&
                  friends.map((item, key) => (
                    <Link
                      to='/profile'
                      className={styles.link}
                      state={item.id}
                      key={key}
                    >
                      <Friends user={{ item }} />
                    </Link>
                  ))}
                {friends === undefined ||
                  (friends.length === 0 && (
                    <p className={styles.NoFriends}>No friends</p>
                  ))}
              </div>
            </Scrollbars>
          </div>
        </div>

        <div className={styles.Feed}>
          <h3 className={styles.postsTitle}>Posts from friends</h3>
          <hr className={styles.postsLine} />

          <Scrollbars style={{ height: '79vh' }}>
            {posts.friendsPosts &&
              posts.friendsPosts.map((item, key) => (
                <Feed
                  key={key}
                  post={item.post}
                  dateAndTime={item.dateTime}
                  user={{
                    firstName: item.firstName,
                    lastName: item.lastName,
                    image: item.image,
                  }}
                />
              ))}
            {posts.friendsPosts === undefined ||
              (posts.friendsPosts.length === 0 && (
                <p className={styles.NoPostsText}>There are no posts</p>
              ))}
          </Scrollbars>
        </div>
        <div className={styles.FriendsOnline}>
          <div className={styles.Ads}>{/* <Ads /> */}</div>
          <h3 className={styles.titleOnline}>Online</h3>
          <div className={styles.Friends}>
            <div className={styles.ListFriends}>
              {onlineFriends &&
                onlineFriends.map((item, key) => (
                  <Link
                    className={styles.link}
                    key={key}
                    to='/profile'
                    state={item.id}
                  >
                    <Friends
                      key={key}
                      user={{
                        item,
                      }}
                      display={true}
                    />
                  </Link>
                ))}
              {onlineFriends === undefined ||
                (onlineFriends.length === 0 && (
                  <p className={styles.NoFriendsText}>No friends online</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PickImage(props) {
  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: false,
    limitFilesConfig: { max: 2 },
    maxFileSize: 10,
  });

  useEffect(() => {
    filesContent.forEach((file) => {
      props.setImage(file.content);
    });
  }, [filesContent]);

  if (errors.length) {
    return <div>Error...</div>;
  }

  return <BsPlusCircle onClick={() => openFileSelector()} />;
}
