import { tokens } from "@/themes/theme";
import { Box, useTheme } from "@mui/material";

export default function ProgressBar({ progress = "0.75", size = 60 }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isLightMode = theme.palette.mode === "light";
    const angle = Number(progress) * 360;

    // console.log(progress, size);

    return (
        <Box sx={{
            background: `radial-gradient(${isLightMode ? colors.greyAccent[800] : colors.greyAccent[500]} 55%, transparent 56%), conic-gradient(${colors.yellowAccent[500]} 0deg ${angle}deg, ${colors.orangeAccent[300]} ${angle}deg 360deg) 
            ${colors.whiteAccent[600]}`,
            borderRadius: "50%",
            width: `${size}px`,
            height: `${size}px`,
        }} />
    )
}
