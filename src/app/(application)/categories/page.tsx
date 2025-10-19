// app/categories/page.tsx

import { Typography } from "@/components/typography";
import CategoriesDataTable from ".";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Typography variant="Bold_H2" className="mb-2">
          Categories Management
        </Typography>
        <Typography variant="Regular_H6" className="text-muted-foreground">
          Manage all service categories and their settings
        </Typography>
      </div>
      <CategoriesDataTable />
    </div>
  );
}
