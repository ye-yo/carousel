import './GNB.css';

function GNB() {
    const menuList = [{ name: "채용" }, { name: "이벤트" }, { name: "직군별 연봉" }, { name: "이력서" }, { name: "커뮤니티", comment: "New" }, { name: "프리랜서" }, { name: "AI 합격예측", comment: "Beta" }];
    return (
        <ul className="GNB">
            {menuList.map(({ name, comment }, index) => (
                <li key={index}><a>{name}{comment && <span>{comment}</span>}</a></li>
            ))}
        </ul>
    );
}

export default GNB;
