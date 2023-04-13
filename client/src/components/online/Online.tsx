import './online.css';
import { IUser } from '../../types/IUser';

interface OnlineProps {
  user: IUser;
}

export default function Online({ user }: OnlineProps) {
  return (
    <li className="rightBarFriend">
      <div className="rightBarProfileImgContainer">
        <img className="rightBarProfileImg" src={user.profilePicture} alt="" />
        <span className="rightBarOnline"></span>
      </div>
      <span className="rightBarUsername">{user.username}</span>
    </li>
  );
}
