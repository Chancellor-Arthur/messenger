import './profile.css';
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import ProfileRightbar from '../../components/profileRightbar/ProfileRightbar';

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img className="profileCoverImg" src={user.cover ? PF + user.cover : PF + 'person/noCover.png'} alt="" />
              <img
                className="profileUserImg"
                src={user.avatar ? PF + user.avatar : PF + 'person/noAvatar.png'}
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.description}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            {user._id && <ProfileRightbar user={user} />}
          </div>
        </div>
      </div>
    </>
  );
}
