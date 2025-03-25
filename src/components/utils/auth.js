const API_URL = "http://localhost:8080/MeetingRoomBooking/auth";

// Kiểm tra token hợp lệ từ API
export const isAccessTokenValid = async () => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/introspect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();

    if (result.success && result.data.valid) {
      return true;
    } else {
      return await refreshAccessToken(); // Nếu token không hợp lệ thì thử làm mới
    }
  } catch (err) {
    console.error("Error checking token validity:", err);
    return false;
  }
};

// Làm mới token khi hết hạn
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!response.ok) throw new Error("Failed to refresh token");

    const result = await response.json();

    if (result.success) {
      sessionStorage.setItem("accessToken", result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error refreshing token:", err);
    return false;
  }
};

// Lấy refreshToken từ cookie
export const getRefreshToken = () => {
  const cookies = document.cookie.split("; ");
  const refreshToken = cookies.find((row) => row.startsWith("refreshToken="));
  return refreshToken ? refreshToken.split("=")[1] : null;
};

// Đặt refreshToken vào cookie
export const setRefreshToken = (token) => {
  document.cookie = `refreshToken=${token}; path=/; secure; samesite=strict;`;
};