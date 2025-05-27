import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  Typography,
} from "@mui/material";

export function ProviderCard({ providersProfile }) {
  return (
    <Card>
      <Link to={`/providers/${providersProfile._id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <CardHeader
          title={providersProfile.businessName}
          subheader={`${providersProfile.services} • ${providersProfile.location}`}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {providersProfile.bio}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Availability: {formatAvailability(providersProfile.availability)}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
}


function formatAvailability(availability) {
  if (!availability) return "Not set";
  return Object.entries(availability)
    .filter(([day, value]) => value.available)
    .map(([day, value]) => `${day}: ${value.start} - ${value.end || "?"}`)
    .join(" | ");
}