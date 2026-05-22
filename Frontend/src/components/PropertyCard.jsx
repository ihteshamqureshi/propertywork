import { MapPin, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../services/api";

function PropertyCard({ property }) {

  const handleDelete = async () => {
    await API.delete(`/${property._id}`);
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      {/* IMAGE */}
      <img
        src={property.photos?.[0] || "https://via.placeholder.com/300"}
        className="h-40 w-full object-cover"
      />

      <div className="p-4">

        <h2 className="font-bold text-lg">{property.title}</h2>

        <p className="text-green-600 font-semibold">
          PKR {property.price}
        </p>

        <p className="flex items-center text-gray-500 text-sm gap-1">
          <MapPin size={14} />
          {property.location?.city}
        </p>

        {/* BUTTONS */}
        <div className="flex justify-between mt-4">

          <Link to={`/property/${property._id}`}>
            <button className="flex items-center gap-1 text-blue-600">
              <Eye size={16} />
              View
            </button>
          </Link>

          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-600"
          >
            <Trash2 size={16} />
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}

export default PropertyCard;