import React, { useState } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import exportTasksToWord from "../../util/export-tasks-to-word";

interface ExportDocxDialogProps {}

const ExportDocxDialog = ({
  ...dialogProps
}: ExportDocxDialogProps & DialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [fileName, setFileName] = useState("output");
  const [language, setLanguage] = useState("EN");
  const [headerChecked, setHeaderChecked] = useState(false);
  const [header1, setHeader1] = useState("");
  const [header2, setHeader2] = useState("");
  const [footerChecked, setFooterChecked] = useState(false);
  const [footer1, setFooter1] = useState("");
  const [footer2, setFooter2] = useState("");
  const [footer3, setFooter3] = useState("");
  const [coverChecked, setCoverChecked] = useState(false);
  const [cover1, setCover1] = useState("");
  const [cover2, setCover2] = useState("");
  const [cover3, setCover3] = useState("");
  const [coverType, setCoverType] = useState("");

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  const handleHeaderCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderChecked(event.target.checked);
  };

  const handleHeader1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeader1(event.target.value);
  };

  const handleHeader2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeader2(event.target.value);
  };

  const handleFooterCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFooterChecked(event.target.checked);
  };

  const handleFooter1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFooter1(event.target.value);
  };

  const handleFooter2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFooter2(event.target.value);
  };

  const handleFooter3Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFooter3(event.target.value);
  };

  const handleCoverCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCoverChecked(event.target.checked);
  };

  const handleCover1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCover1(event.target.value);
  };

  const handleCover2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCover2(event.target.value);
  };

  const handleCover3Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCover3(event.target.value);
  };

  const handleCoverTypeChange = (event: SelectChangeEvent) => {
    setCoverType(event.target.value as string);
  };

  const isFileNameValid = /^[\w\d]+(\.[\w\d]+)?$/.test(fileName);

  const handleConfirm = () => {
    // const data = {
    //   cover_page_002: true,
    //   company_name: "ABC Company",
    //   report_title: "Issue List",
    //   lorem_text: "Thống kê công việc quý 2 năm 2023, lưu sổ BM02-23",
    //   tasks: tasks.map((task) => ({
    //     title: task.title,
    //     content: task.content || "",
    //     status: task.status,
    //     assignee_id: task.assignee_id,
    //     creator_id: task.creator_id,
    //     created_at: task.created_at,
    //     deadline: task.deadline || "",
    //     last_edit: task.last_edit || "",
    //     room: "TODO",
    //   })),
    // };
    // exportTasksToWord(data);
    // const data = {
    //   fileName,
    //   language,
    //   headerChecked,
    //   header1,
    //   header2,
    //   footerChecked,
    //   footer1,
    //   footer2,
    //   footer3,
    //   coverChecked,
    //   cover1,
    //   cover2,
    //   cover3,
    //   coverType,
    // };
    dialogProps.onClose?.({}, "backdropClick");
  };
  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth="md"
      {...dialogProps}
    >
      <Box p={2}>
        <Typography variant="h5" component="div">
          Xuất danh sách công việc sang file docx
        </Typography>
        <TextField
          label="Tên file"
          variant="outlined"
          fullWidth
          margin="normal"
          value={fileName}
          onChange={handleFileNameChange}
          error={!isFileNameValid}
          helperText={
            !isFileNameValid &&
            "Tên file không hợp lệ. Chỉ chấp nhận các ký tự chữ cái, số, và dấu chấm. Tên file không được rỗng."
          }
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Ngôn ngữ</InputLabel>
          <Select
            value={language}
            onChange={handleLanguageChange}
            variant="outlined"
            label="Ngôn ngữ"
            fullWidth
          >
            <MenuItem value="VI">Tiếng Việt</MenuItem>
            <MenuItem value="EN">Tiếng Anh</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={headerChecked}
              onChange={handleHeaderCheck}
              color="primary"
            />
          }
          label="Header"
        />
        <Box display="flex" gap={1}>
          <TextField
            label="Left header"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!headerChecked}
            value={header1}
            onChange={handleHeader1Change}
          />
          <TextField
            label="Right header"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!headerChecked}
            value={header2}
            onChange={handleHeader2Change}
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={footerChecked}
              onChange={handleFooterCheck}
              color="primary"
            />
          }
          label="Footer"
        />
        <Box display="flex" gap={1}>
          <TextField
            label="Left footer"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!footerChecked}
            value={footer1}
            onChange={handleFooter1Change}
          />
          <TextField
            label="Center footer"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!footerChecked}
            value={footer2}
            onChange={handleFooter2Change}
          />
          <TextField
            label="Right footer"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!footerChecked}
            value={footer3}
            onChange={handleFooter3Change}
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={coverChecked}
              onChange={handleCoverCheck}
              color="primary"
            />
          }
          label="Bìa"
        />
        <Box display="flex" gap={1}>
          <TextField
            label="Company's name"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!coverChecked}
            value={cover1}
            onChange={handleCover1Change}
          />
          <TextField
            label="Report title"
            variant="outlined"
            fullWidth
            margin="normal"
            disabled={!coverChecked}
            value={cover2}
            onChange={handleCover2Change}
          />
        </Box>
        <TextField
          label="Caption text"
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={!coverChecked}
          value={cover3}
          onChange={handleCover3Change}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Loại bìa</InputLabel>
          <Select
            value={coverType}
            onChange={handleCoverTypeChange}
            variant="outlined"
            label="Loại bìa"
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
        <Box display="flex" justifyContent="flex-end" mt={2}>
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
            onClick={handleConfirm}
          >
            Đồng ý
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ExportDocxDialog;
