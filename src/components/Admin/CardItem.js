import { useNavigate } from "react-router-dom";

export default function CardItem({ name, path }) {
  const navigate = useNavigate();
  
  return (
    <div onClick={() => navigate(path)} className="bg-white shadow-lg p-6 text-center rounded-lg cursor-pointer hover:bg-blue-100 transition">
      <h2 className="text-xl font-bold">{name}</h2>
    </div>
  );
}
