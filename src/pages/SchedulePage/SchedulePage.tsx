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
import TaskData from "../../modules/task/interface/task-data";
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
import { useTasks } from "../../lib/provider/TasksProvider";
import { unionTypeAnnotation } from "@babel/types";
const events = [
  {
    title: "All Day Event very long title",
    allDay: true,
    start: new Date(2023, 7, 7),
    end: new Date(2023, 7, 7),
  },
  {
    title: "Long Event",
    start: new Date(2023, 3, 7),
    end: new Date(2023, 3, 10),
  },

  {
    title: "DTS STARTS",
    start: new Date(2016, 2, 13, 0, 0, 0),
    end: new Date(2016, 2, 20, 0, 0, 0),
  },
];
interface Event {
  title: string;
  start: Date;
  end: Date;
}
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
const SchedulePage = () => {
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );
  const { rooms, getRooms, loadingRooms, loadingMoreRooms, loadedAllRooms } =
    useRooms();
  const [TotalTasks, setTotalTasks] = useState<TaskData[]>([]);
  const {
    tasks,
    getTasks,
  } = useTasks();
  useEffect(() => {
    getRooms({ getLimit:9999 });
  }, []);
  useEffect(() => {
    if(rooms){
      rooms.forEach(async (room)=>{
        await getTasks({room_id:room.id})
        const new_total_task=[...TotalTasks]
        tasks.forEach(value=>{
          if(!TotalTasks.includes(value)&&value.deadline){
            TotalTasks.push(value)
          }
        })
        setTotalTasks([...new_total_task])
      })
    }
  }, [rooms]);
  useEffect(() => {
    console.log(TotalTasks)
    setMyEvents(TotalTasks.map((task)=>({
      title: task.title,
      start: task.deadline,
      allDay: true,
      end: task.deadline,
    })))
  }, [TotalTasks]);
  useEffect(() => {
    console.log(myEvents)
  }, [myEvents]);
  return (
    <Fragment>
      <Calendar
        localizer={localizer}
        events={myEvents}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, padding: 5 }}
      />
    </Fragment>
  );
};

export default SchedulePage;
