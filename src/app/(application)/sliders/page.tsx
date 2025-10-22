// src/app/(application)/sliders/page.tsx

import { Typography } from "@/components/typography";
import SlidersDataTable from ".";

export default function SlidersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Typography variant="Bold_H2" className="mb-2">
          Hero Sliders Management
        </Typography>
        <Typography variant="Regular_H6" className="text-muted-foreground">
          Manage homepage hero sliders and their display order
        </Typography>
      </div>
      <SlidersDataTable />
    </div>
  );
}
