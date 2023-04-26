import './message.css';
import { format } from 'timeago.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Message({ message, own, userId }) {
  const [user, setUser] = useState();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getUser = async () => {
      if (!userId) return;
      try {
        const user = await axios.get('/users/' + userId);
        setUser(user.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [userId]);

  return (
    <div className={own ? 'message own' : 'message'}>
      <div className="messageTop">
        <img className="messageImg" src={user && user.avatar ? PF + user.avatar : PF + 'person/noAvatar.png'} alt="" />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
