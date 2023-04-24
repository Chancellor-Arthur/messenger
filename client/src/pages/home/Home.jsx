import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import './home.css';
import HomeRightbar from '../../components/homeRightbar/HomeRightbar';

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        <HomeRightbar />
      </div>
    </>
  );
}
