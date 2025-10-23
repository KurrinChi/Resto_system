// src/components/admin/settings/SettingsForm.tsx
import React from "react";
import { THEME } from "../../../constants/theme";

interface SettingsFormProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  title,
  children,
}) => {
  return (
    <div>
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: THEME.colors.text.primary }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
};
