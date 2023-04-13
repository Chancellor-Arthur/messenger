import './topbar.css';
import { Search, Person, Chat, Notifications } from '@material-ui/icons';

export default function TopBar() {
  return (
    <div className="topBarContainer">
      <div className="topBarLeft">
        <span className="logo">In Touch</span>
      </div>
      <div className="topBarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input placeholder="Search for friend, post or video" className="searchInput" />
        </div>
      </div>
      <div className="topBarRight">
        <div className="topbarLinks">
          <span className="topBarLink">Homepage</span>
          <span className="topBarLink">Timeline</span>
        </div>
        <div className="topBarIcons">
          <div className="topBarIconItem">
            <Person />
            <span className="topBarIconBadge">1</span>
          </div>
          <div className="topBarIconItem">
            <Chat />
            <span className="topBarIconBadge">2</span>
          </div>
          <div className="topBarIconItem">
            <Notifications />
            <span className="topBarIconBadge">1</span>
          </div>
        </div>
        <img src="/assets/person/1.jpeg" alt="" className="topBarImg" />
      </div>
    </div>
  );
}
