// ProviderPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Reviews from "../components/Reviews";
import { getProfile } from "../api";

export default function ProviderPage() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const token = sessionStorage.getItem("token")

  useEffect(() => {
    const fetchProvider = async () => {
      const data = await getProfile(id);
      setProvider(data);
    };
    fetchProvider();
  }, [id]);

  if (!provider) return <p>Loading provider...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{provider.businessName}</h1>
      <p>{provider.services} • {provider.location}</p>
      <p>{provider.bio}</p>

      {/* Reviews Section */}
      <Reviews providerId={id} token={token} />
    </div>
  );
}
