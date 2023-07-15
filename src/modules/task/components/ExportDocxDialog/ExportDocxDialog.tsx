import {
  Box,
  Dialog,
  DialogProps,
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { useRooms } from "../../../../lib/provider/RoomsProvider";
import { useUser } from "../../../../lib/provider/UserProvider";
import makeStyles from "@mui/styles/makeStyles";
import { useState } from "react";

interface ExportDocxDialogProps {}

const useStyle = makeStyles((theme) => ({
  dialog: {
    padding: "8px 24px 16px",
  },
  edit_field: {
    transition: "background 0.4s ease",
    "&:hover": {
      background: "#EBECF0",
    },
  },
  field_title: {
    fontFamily:
      "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "24px",
    color: "#666666",
  },
  dialogHeader: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    padding: "16px 0",
    marginBottom: 16,
    boxShadow: "0px 2px 4px rgba(30, 136, 229, 0.1)",
    fontWeight: "bold",
    background: "white",
  },
}));

const ExportDocxDialog = ({
  ...dialogProps
}: ExportDocxDialogProps & DialogProps) => {
  const classes = useStyle();
  const { currentRoom, loadingCurrentRoom } = useRooms();
  const { user } = useUser();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [fileName, setFileName] = useState("");
  const [headerChecked, setHeaderChecked] = useState(false);
  const [footerChecked, setFooterChecked] = useState(false);
  const [coverChecked, setCoverChecked] = useState(false);

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const handleHeaderCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderChecked(event.target.checked);
  };

  const handleFooterCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFooterChecked(event.target.checked);
  };

  const handleCoverCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCoverChecked(event.target.checked);
  };

  const isFileNameValid = fileName.trim() !== "";

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth="md"
      {...dialogProps}
    >
      <Box className={classes.dialog}>
        {/* Header of the dialog */}
        <Box className={classes.dialogHeader}>
          <Typography variant="h5" component="div">
            Xuất danh sách công việc sang file docx
          </Typography>
        </Box>
        {/* Body of the dialog */}
        <TextField
          label="Tên file"
          variant="outlined"
          fullWidth
          margin="normal"
          value={fileName}
          onChange={handleFileNameChange}
          error={!isFileNameValid}
          helperText={!isFileNameValid && "Tên file không được để trống"}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Ngôn ngữ</InputLabel>
          <Select defaultValue="" variant="outlined" label="Ngôn ngữ" fullWidth>
            <MenuItem value="VI">Tiếng Việt</MenuItem>
            <MenuItem value="EN">Tiếng Anh</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox checked={headerChecked} onChange={handleHeaderCheck} />
          }
          label="Header"
        />
        <Box style={{ display: "flex", gap: 10 }}>
          <TextField
            label="Left header"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!headerChecked}
          />
          <TextField
            label="Right header"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!headerChecked}
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox checked={footerChecked} onChange={handleFooterCheck} />
          }
          label="Footer"
        />
        <Box style={{ display: "flex", gap: 10 }}>
          <TextField
            label="Left footer"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!footerChecked}
          />
          <TextField
            label="Center footer"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!footerChecked}
          />
          <TextField
            label="Right footer"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!footerChecked}
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox checked={coverChecked} onChange={handleCoverCheck} />
          }
          label="Bìa"
        />
        <Box style={{ display: "flex", gap: 10 }}>
          <TextField
            label="Company's name"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!coverChecked}
          />
          <TextField
            label="Report title"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!coverChecked}
          />
        </Box>
        <TextField
          label="Caption text"
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={!coverChecked}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Loại bìa</InputLabel>
          <Select
            defaultValue=""
            variant="outlined"
            label="Mẫu bìa"
            fullWidth
            disabled={!coverChecked}
          >
            <MenuItem value="Loại 1">Loại 1</MenuItem>
            <MenuItem value="Loại 2">Loại 2</MenuItem>
            <MenuItem value="Loại 3">Loại 3</MenuItem>
            <MenuItem value="Loại 4">Loại 4</MenuItem>
            <MenuItem value="Loại 5">Loại 5</MenuItem>
            <MenuItem value="Loại 6">Loại 6</MenuItem>
          </Select>
        </FormControl>
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Button
            onClick={() => {
              dialogProps.onClose?.({}, "backdropClick");
            }}
          >
            Thoát
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!isFileNameValid}
          >
            Đồng ý
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ExportDocxDialog;
