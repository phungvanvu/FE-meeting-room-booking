import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { createCookie, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Thêm state để quản lý loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Bắt đầu loading

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/MeetingRoomBooking/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Nếu status không phải 200, xử lý lỗi
        const result = await response.json();
        throw new Error(result.error || "Tên đăng nhập hoặc mật khẩu không đúng!");
      }

      const result = await response.json();

      if (result.success) {
        // Lưu token vào localStorage
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);

        alert("Đăng nhập thành công!");
        navigate("/home"); // Điều hướng đến trang chủ
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold text-center text-gray-700">Đăng Nhập</h2>

        {/* Thông báo lỗi */}
        {error && (
          <p className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm mt-4 text-center">
            {error}
          </p>
        )}

        <form className="mt-6" onSubmit={handleLogin}>
          {/* Tên đăng nhập */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          {/* Mật khẩu */}
          <div className="mb-4 relative">
            <label className="block text-gray-600 font-medium">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              autoComplete="off"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold py-2 rounded-lg transition-all active:scale-95`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>

          {/* Điều hướng đến trang Đăng ký */}
          <p className="mt-4 text-center text-gray-600">
            Chưa có tài khoản?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Đăng ký ngay
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
