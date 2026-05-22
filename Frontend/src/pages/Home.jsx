import { useEffect, useState } from "react";
import API from "../services/api";
import PropertyCard from "../components/PropertyCard";
import PropertyForm from "../components/PropertyForm";
import { Plus } from "lucide-react";

function Home() {
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchProperties = async () => {
    try {
      const res = await API.get("/");
      setProperties(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          🏡 Property Dashboard
        </h1>

        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={18} />
          Add Property
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {properties.map((item) => (
          <PropertyCard key={item._id} property={item} />
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-[500px] p-5 rounded-xl relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              ✕
            </button>

            <PropertyForm
              editData={editData}
              closeModal={() => setShowModal(false)}
              refresh={fetchProperties}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;