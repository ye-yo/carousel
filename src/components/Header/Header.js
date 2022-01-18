import './Header.css';
import GNB from './GNB/GNB';
import Aside from './Aside/Aside';
import { ReactComponent as Logo } from '../../assets/icons/logo.svg'

function Header() {
    return (
        <header>
            <div className="header-main">
                <nav className="header-nav">
                    <div className="header-logo">
                        <button>
                            <img src="https://static.wanted.co.kr/images/icon-menu.png" alt="hamberger menu"></img>
                        </button>
                        <a href="/"><Logo width="100" /></a>
                    </div>
                    <GNB />
                    <Aside />
                </nav>
            </div>
        </header>
    );
}

export default Header;
