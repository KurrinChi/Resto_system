import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { THEME } from "../../../constants/theme";
export const SettingsForm = ({ title, children, }) => {
    return (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", style: { color: THEME.colors.text.primary }, children: title }), children] }));
};
