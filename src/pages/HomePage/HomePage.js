import React, { useEffect, useState } from 'react';
import styles from './HomePage.module.css';
import NoImage from '../../images/NoImage.png';
import { Link, useNavigate } from 'react-router-dom';
import { BsPlusCircle, BsSearch } from 'react-icons/bs';
import { MdPhotoSizeSelectActual } from 'react-icons/md';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useFilePicker } from 'use-file-picker';
import Navigation from '../../components/NavigationBar/NavigationBar';
import SearchModal from '../../components/SearchModal';
import Feed from '../../components/Feed/Feed';
import Friends from '../../components/Friends/Friends';

const URL_REQUEST = 'http://localhost:3004/';

export default function HomePage() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState({
    friendsPosts: [],
    newPosts: [],
    postExist: false,
  });
  const [friends, setFriends] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [update, setUpdate] = useState('');
  const [show, setShow] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const navigation = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getUser();
  }, [selectedImage, show]);

  useEffect(() => {
    getOnlineUsers().then(() => getUserFriendsPosts());
  }, [user]);

  const getUser = async () => {
    await fetch(
      URL_REQUEST + `users_data/${localStorage.getItem('CurrentUserID')}`,
      {
        method: 'GET',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setUserStatus(true, data);
      });
  };

  const getUserFriendsPosts = async () => {
    let posts = [];
    user.friends.forEach(async (item, index) => {
      await fetch(URL_REQUEST + `users_data/${item}`)
        .then((response) => response.json())
        .then((data) => {
          let post = {
            posts: data.posts,
            firstName: data.firstName,
            lastName: data.lastName,
            image: data.images[0],
          };
          posts.push(post);
        });
      if (index === user.friends.length - 1) {
        setPosts({ friendsPosts: sortPosts(posts) });
      }
    });
    if (user.friends.length === 0) setPosts({ friendsPosts: sortPosts(posts) });
  };

  const getOnlineUsers = async () => {
    let friends = [];
    user.friends.forEach(async (item) => {
      await fetch(URL_REQUEST + `users_data/${item}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.online) friends.push(data.id);
        });
    });
    setFriends(friends);
  };

  const getNewPosts = () => {
    setPosts({ friendsPosts: sortPosts(posts.newPosts), postExist: false });
  };

  const sortPosts = (posts) => {
    let newArray = [];
    posts.map((item) => {
      item.posts.forEach((second) =>
        newArray.push({
          post: second.post,
          dateTime: second.dateTime,
          firstName: item.firstName,
          lastName: item.lastName,
          image: item.image,
        })
      );
    });
    newArray = newArray.sort(function (a, b) {
      return new Date(b.dateTime) - new Date(a.dateTime);
    });
    return newArray;
  };

  const checkForNewData = () => {
    getOnlineUsers();
    let newPosts = [];
    user.friends.forEach(async (item, index) => {
      await fetch(URL_REQUEST + `users_data/${item.id}`)
        .then((response) => response.json())
        .then((data) => {
          let post = {
            posts: data.posts,
            firstName: data.firstName,
            lastName: data.lastName,
            image: data.images[0],
          };
          newPosts.push(post);
        });
      if (index === user.friends.length - 1) {
        comparePosts(newPosts);
      }
    });
  };

  const comparePosts = (second) => {
    let oldPosts = posts.friendsPosts.length;
    let newPosts = sortPosts(second).length;

    if (oldPosts !== newPosts) {
      this.setState({ postExist: true, newPosts: second });
      setPosts({ postExist: true, newPosts: second });
    }
    if (posts.postExist) clearInterval(update);
  };

  const setUserStatus = async (status, user) => {
    fetch(URL_REQUEST + `users_data/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...user,
        online: status,
      }),
    });
  };

  const setImage = async (image) => {
    setSelectedImage(image);
    let imagesArray = [...user.images];
    imagesArray.unshift(image);
    await fetch(URL_REQUEST + `users_data/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...user,
        images: imagesArray,
      }),
    });
  };

  const showModal = async () => {
    await fetch(URL_REQUEST + 'users_data', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => setAllUsers(data))
      .then(() => setShow((prevState) => !prevState));
  };

  const closeModal = () => {
    setShow((prevState) => !prevState);
  };

  const logOut = () => {
    setUserStatus(false, user).then(() => {
      localStorage.clear();
      document.cookie = false;
      navigation('/', { replace: true });
    });
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
        <button
          style={{
            position: 'absolute',
            left: 'calc(50% - 75px)',
            width: 150,
            marginTop: 60,
            border: 'none',
            borderRadius: 10,
            padding: 5,
            fontWeight: 'bold',
            backgroundColor: 'white',
            boxShadow: '0px 0px 5px 8px rgba(34, 60, 80, 0.2)',
            visibility: posts.postExist ? 'visible' : 'hidden',
          }}
          onClick={getNewPosts}
        >
          New posts...
        </button>
        <div>
          <div className={styles.Profile}>
            <img
              src={
                user.images !== undefined && user.images.length > 0
                  ? user.images[0]
                  : NoImage
              }
              alt='Image'
            />
            <div className={styles.ProfileImage}>
              <PickImage setImage={(image) => setImage(image)} />
            </div>
          </div>
          <div>
            <Link to='/profile' state={user.id} className={styles.UserName}>
              {user.firstName + ' ' + user.lastName}
            </Link>
          </div>
          <div className={styles.ProfileButtons}>
            <Link to='/photos' className={styles.Buttons}>
              <MdPhotoSizeSelectActual
                style={{ color: 'black', marginRight: 5 }}
              />
              Photos
            </Link>
          </div>
          <hr style={{ color: 'white', height: 3 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link
              to='/friends'
              state={user.friends}
              style={{ textDecoration: 'none' }}
            >
              <h3
                style={{
                  marginLeft: 20,
                  color: 'black',
                  textShadow: '2px 2px rgba(0,0,0,0.2)',
                }}
              >
                Friends
              </h3>
            </Link>

            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                marginTop: -5,
                marginRight: 20,
              }}
              onClick={showModal}
            >
              <BsSearch />
            </button>
          </div>

          <div className={styles.Friends}>
            <Scrollbars>
              <div className={styles.ListFriends}>
                {user.friends &&
                  user.friends.map((item, key) => (
                    <Link
                      to='/profile'
                      style={{ textDecoration: 'none' }}
                      state={item}
                      key={key}
                    >
                      <Friends user={{ item }} />
                    </Link>
                  ))}
                {user.friends === undefined ||
                  (user.friends.length === 0 && (
                    <p className={styles.NoFriends}>No friends</p>
                  ))}
              </div>
            </Scrollbars>
          </div>
        </div>

        <div className={styles.Feed}>
          <h3
            style={{
              marginTop: 20,
              marginLeft: 20,
              marginBottom: 0,
              color: 'black',
            }}
          >
            Posts from friends
          </h3>
          <hr style={{ color: 'white', height: 2 }} />

          <Scrollbars style={{ height: '80vh' }}>
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
          <hr style={{ height: 3, color: 'white' }} />
          <h3 style={{ marginLeft: 20, color: 'black' }}>Online</h3>
          <div style={{ height: 330 }} className={styles.Friends}>
            <div className={styles.ListFriends}>
              {friends &&
                friends.map((item, key) => (
                  <Friends
                    key={key}
                    user={{
                      item,
                    }}
                    display={true}
                  />
                ))}
              {friends === undefined ||
                (friends.length === 0 && (
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
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: false,
    limitFilesConfig: { max: 2 },
    // minFileSize: 1,
    maxFileSize: 10, // in megabytes
  });

  useEffect(() => {
    filesContent.map((file) => {
      props.setImage(file.content);
    });
  }, [filesContent]);

  if (errors.length) {
    return <div>Error...</div>;
  }

  return <BsPlusCircle onClick={() => openFileSelector()} />;
}
