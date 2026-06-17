import "./table.css";

const TableTest = () => {
    return (
        <div className="table_layout">
            <table>
                {/* <colgroup>
                    <col span={5} className="fixedCol" />
                    <col span={6} className="fixedCol2" />
                </colgroup> */}
                <thead>
                    <tr>
                        <div className="fixed_col">
                            <th>상점 이름</th>
                            <th>단말기 아이디</th>
                            <th>화재 경보</th>
                            <th>배터리 상태</th>
                            <th>변형 감지</th>
                        </div>
                        <div className="scroll_col">
                            <th>열감지 온도</th>
                            <th>실내 온도</th>
                            <th>연기 농도</th>
                            <th>상대 습도</th>
                            <th>Co2</th>
                            <th>TVOC</th>
                        </div>
                    </tr>
                </thead>
            </table>
        </div>
    )
}
export default TableTest;