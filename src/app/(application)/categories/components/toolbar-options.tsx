// src/api/categories/components/toolbar-options.tsx
"use client";

import React from "react";

interface ToolbarOptionsProps {
  selectedCategories: { id: string; name: string }[];
  allSelectedCategoryIds?: (string | number)[];
  totalSelectedCount: number;
  resetSelection: () => void;
  onSuccess?: () => void;
}

export const ToolbarOptions = ({
  selectedCategories,
  allSelectedCategoryIds = [],
  totalSelectedCount,
  resetSelection,
  onSuccess,
}: ToolbarOptionsProps) => {
  // Empty toolbar for now - can add bulk actions later
  return null;
};
