import { useEffect, useState } from "react";

export default function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Lấy token đã lưu
        if (!token) {
          setError("Bạn chưa đăng nhập!");
          return;
        }

        const response = await fetch("http://localhost:8080/MeetingRoomBooking/user/my-info", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`, // Gửi token trong header
            "Content-Type": "application/json"
          }
        });

        const result = await response.json();
        if (result.success) {
          setUserInfo(result.data);
        } else {
          setError(result.error || "Không lấy được thông tin user!");
        }
      } catch (err) {
        setError("Lỗi khi lấy thông tin user!");
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <h1>Trang Home</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {userInfo ? (
        <div>
          <p><b>Tên đăng nhập:</b> {userInfo.userName}</p>
          <p><b>Họ tên:</b> {userInfo.fullName}</p>
          <p><b>Phòng ban:</b> {userInfo.department}</p>
          <p><b>Email:</b> {userInfo.email}</p>
          <p><b>Quyền:</b> {userInfo.roles.join(", ")}</p>
        </div>
      ) : (
        !error && <p>Đang tải thông tin...</p>
      )}
    </div>
  );
}
