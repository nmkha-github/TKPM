import React, {
  Fragment,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Divider,
  IconButton,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { BiFilterAlt } from "react-icons/bi";
import { ImSortAlphaAsc, ImSortAlphaDesc } from "react-icons/im";
import SearchIcon from "@mui/icons-material/Search";
import RoomData from "../../modules/room/interface/room-data";
import { useRooms } from "../../lib/provider/RoomsProvider";
import RoomItem from "../../modules/room/components/RoomItem/RoomItem";
import AddRoomButton from "../../modules/room/components/AddRoomButton/AddRoomButton";
import {
  Calendar,
  momentLocalizer,
  DateLocalizer,
  Views,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
const events = [
  {
    id: 0,
    title: "All Day Event very long title",
    allDay: true,
    start: new Date(2023, 7, 7),
    end: new Date(2023, 7, 7),
  },
  {
    id: 1,
    title: "Long Event",
    start: new Date(2023, 3, 7),
    end: new Date(2023, 3, 10),
  },

  {
    id: 2,
    title: "DTS STARTS",
    start: new Date(2016, 2, 13, 0, 0, 0),
    end: new Date(2016, 2, 20, 0, 0, 0),
  },
];
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
const SchedulePage = () => {
  const [myEvents, setMyEvents] = useState(events);
  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );
  const { rooms, getRooms, loadingRooms, loadingMoreRooms, loadedAllRooms } =
    useRooms();
  console.log(rooms);
  return (
    <Fragment>
      <Calendar
        localizer={localizer}
        events={events}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, padding: 5 }}
      />
    </Fragment>
  );
};

export default SchedulePage;
