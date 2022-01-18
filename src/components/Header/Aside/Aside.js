import './Aside.css';
import { ReactComponent as SearchIcon } from '../../../assets/icons/ic_search.svg'
import { ReactComponent as AlertIcon } from '../../../assets/icons/ic_alert.svg'
import { ReactComponent as NewIcon } from '../../../assets/icons/ic_new.svg'

function Aside() {
    return (
        <aside className="header-aside">
            <ul>
                <li><button><SearchIcon /></button>
                </li>
                <li>
                    <button><AlertIcon fill="#333" /></button>
                    <span className="badge-new-content"><NewIcon /></span>
                </li>
                <li>
                    <button>
                        <div className="profile-border">
                            <div className="profile"></div>
                        </div>
                    </button>
                    <span className="badge-new-content"><NewIcon /></span>
                </li>
                <li className="left-division"><a className="link-company-service">기업서비스</a></li>
            </ul>
        </aside>
    );
}

export default Aside;
