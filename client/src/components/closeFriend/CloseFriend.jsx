import './closeFriend.css';
import { Link } from 'react-router-dom';

export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="sidebarFriend">
      <img className="sidebarFriendImg" src={user.avatar ? PF + user.avatar : PF + 'person/noAvatar.png'} alt="" />
      <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
        <span className="sidebarFriendName">{user.username}</span>
      </Link>
    </li>
  );
}
