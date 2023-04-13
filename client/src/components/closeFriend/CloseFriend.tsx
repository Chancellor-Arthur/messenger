import './closeFriend.css';
import { IUser } from '../../types/IUser';

interface CloseFriendProps {
  user: IUser;
}

export default function CloseFriend({ user }: CloseFriendProps) {
  return (
    <li className="sidebarFriend">
      <img className="sidebarFriendImg" src={user.profilePicture} alt="" />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}
