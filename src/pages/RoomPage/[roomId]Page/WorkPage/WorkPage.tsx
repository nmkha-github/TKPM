import React, { useEffect, useState } from "react";
import LeftSideBar from "../../../../modules/room/components/LeftSideBar/LeftSideBar";
import { useRooms } from "../../../../lib/provider/RoomsProvider";
import { useParams } from "react-router-dom";
import TaskData from "../../../../modules/task/interface/task-data";
import TaskDetailDialog from "../../../../modules/task/components/TaskDetailDialog/TaskDetailDialog";
import TaskList from "../../../../modules/task/components/TaskList/TaskList";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useTasks } from "../../../../lib/provider/TasksProvider";
import { Box, Button, Typography } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";
import CreateTaskDialog from "../../../../modules/task/components/CreateTaskDialog/CreateTaskDialog";
import TaskHelper from "../../../../modules/task/util/task-helper";
import ShowMenuButton from "../../../../lib/components/ShowMenuButton/ShowMenuButton";
import ExportDocxDialog from "../../../../modules/task/components/ExportDocxDialog/ExportDocxDialog";
import exportTasksToWord from "../../../../modules/task/util/export-tasks-to-word";

const WorkPage = () => {
  const [tasksToDo, setTasksToDo] = useState<TaskData[]>([]);
  const [tasksDoing, setTasksDoing] = useState<TaskData[]>([]);
  const [tasksDone, setTasksDone] = useState<TaskData[]>([]);
  const [tasksReviewing, setTasksReviewing] = useState<TaskData[]>([]);

  const { getCurrentRoom, currentRoom } = useRooms();
  const { roomId } = useParams();
  const {
    tasks,
    getTasks,
    updateTask,
    updatingTask,
    currentTask,
    setCurrentTask,
  } = useTasks();
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [openExportDocxDialog, setOpenExportDocxDialog] = useState(false);
  const [isDraggingId, setIsDraggingId] = useState("-1");

  useEffect(() => {
    getCurrentRoom(roomId || "");
  }, [roomId]);

  useEffect(() => {
    if (currentRoom) {
      getTasks({ room_id: roomId || "" });
    }
  }, [currentRoom]);

  const compareTasks = (TaskA: TaskData, TaskB: TaskData) => {
    if (TaskA.order_value >= TaskB.order_value) {
      return 1;
    }
    return -1;
  };

  useEffect(() => {
    setTasksDoing(
      tasks.filter((task) => task.status === "doing").sort(compareTasks)
    );
    setTasksToDo(
      tasks.filter((task) => task.status === "toDo").sort(compareTasks)
    );
    setTasksDone(
      tasks.filter((task) => task.status === "done").sort(compareTasks)
    );
    setTasksReviewing(
      tasks.filter((task) => task.status === "reviewing").sort(compareTasks)
    );
  }, [tasks]);

  function handleOnDragStart(result: DragStart) {
    if (result.source.droppableId === "doing") {
      setIsDraggingId(tasksDoing[result.source.index].id);
    } else if (result.source.droppableId === "toDo") {
      setIsDraggingId(tasksToDo[result.source.index].id);
    } else if (result.source.droppableId === "done") {
      setIsDraggingId(tasksDone[result.source.index].id);
    } else {
      setIsDraggingId(tasksReviewing[result.source.index].id);
    }
  }

  const handleOnDragEnd = async (result: DropResult) => {
    setIsDraggingId("-1");
    if (updatingTask) {
      return;
    }
    if (!result.destination) return;

    let dragTask;
    if (result.source.droppableId === "toDo") {
      dragTask = tasksToDo.at(result.source.index);
      tasksToDo.splice(result.source.index, 1);
      setTasksToDo(tasksToDo);
    } else if (result.source.droppableId === "doing") {
      dragTask = tasksDoing.at(result.source.index);
      tasksDoing.splice(result.source.index, 1);
      setTasksDoing(tasksDoing);
    } else if (result.source.droppableId === "reviewing") {
      dragTask = tasksReviewing.at(result.source.index);
      tasksReviewing.splice(result.source.index, 1);
      setTasksReviewing(tasksReviewing);
    } else {
      dragTask = tasksDone.at(result.source.index);
      tasksDone.splice(result.source.index, 1);
      setTasksDone(tasksDone);
    }

    if (result.destination.droppableId === "toDo") {
      if (dragTask) {
        tasksToDo.splice(result.destination.index, 0, dragTask);
        setTasksToDo(tasksToDo);
        await updateTask({
          room_id: roomId ? roomId : "",
          id: result.draggableId,
          updateData: {
            status: "toDo",
            order_value: TaskHelper.getOrderString(
              tasksToDo[tasksToDo.indexOf(dragTask) - 1]?.order_value ?? "",
              tasksToDo[tasksToDo.indexOf(dragTask) + 1]?.order_value ?? ""
            ),
          },
        });
      }
    } else if (result.destination.droppableId === "doing") {
      if (dragTask) {
        tasksDoing.splice(result.destination.index, 0, dragTask);
        setTasksDoing(tasksDoing);
        await updateTask({
          room_id: roomId ? roomId : "",
          id: result.draggableId,
          updateData: {
            status: "doing",
            order_value: TaskHelper.getOrderString(
              tasksDoing[tasksDoing.indexOf(dragTask) - 1]?.order_value ?? "",
              tasksDoing[tasksDoing.indexOf(dragTask) + 1]?.order_value ?? ""
            ),
          },
        });
      }
    } else if (result.destination.droppableId === "reviewing") {
      if (dragTask) {
        tasksReviewing.splice(result.destination.index, 0, dragTask);
        setTasksReviewing(tasksReviewing);
        await updateTask({
          room_id: roomId ? roomId : "",
          id: result.draggableId,
          updateData: {
            status: "reviewing",
            order_value: TaskHelper.getOrderString(
              tasksReviewing[tasksReviewing.indexOf(dragTask) - 1]
                ?.order_value ?? "",
              tasksReviewing[tasksReviewing.indexOf(dragTask) + 1]
                ?.order_value ?? ""
            ),
          },
        });
      }
    } else if (result.destination.droppableId === "done") {
      if (dragTask) {
        tasksDone.splice(result.destination.index, 0, dragTask);
        setTasksDone(tasksDone);
        await updateTask({
          room_id: roomId ? roomId : "",
          id: result.draggableId,
          updateData: {
            status: "done",
            order_value: TaskHelper.getOrderString(
              tasksDone[tasksDone.indexOf(dragTask) - 1]?.order_value ?? "",
              tasksDone[tasksDone.indexOf(dragTask) + 1]?.order_value ?? ""
            ),
          },
        });
      }
    }
  };

  return (
    <>
      <LeftSideBar>
        <Box style={{ display: "flex", flexDirection: "column" }}>
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              style={{
                margin: "0.625rem",
                width: "200px",
                textTransform: "none",
              }}
              onClick={() => {
                setOpenCreateTaskDialog(true);
              }}
            >
              <Typography style={{ fontWeight: 600 }}>Tạo công việc</Typography>
            </Button>
            <CreateTaskDialog
              open={openCreateTaskDialog}
              onClose={() => {
                setOpenCreateTaskDialog(false);
              }}
            />

            {/* Actions Button */}
            <Box style={{ marginRight: "1rem" }}>
              <ShowMenuButton
                title="Xuất"
                itemsTitle={["Xuất Word", "Xuất HTML", "Xuất CSV"]}
                itemsAction={[
                  () => {
                    setOpenExportDocxDialog(true);
                  },
                  () => {
                    console.log(tasks);
                  },
                  () => {},
                ]}
                tooltipTitle="Xuất tất cả công việc"
              />
            </Box>
          </Box>

          <Box
            style={{
              marginTop: 16,
              marginLeft: 8,
              maxHeight: 700,
            }}
          >
            <DragDropContext
              onDragEnd={handleOnDragEnd}
              onDragStart={handleOnDragStart}
            >
              <PerfectScrollbar>
                <Box style={{ display: "flex" }}>
                  <PerfectScrollbar
                    style={{
                      background: "#f1f3f9",
                      marginRight: 12,
                      width: 300,
                      maxHeight: 700,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      style={{
                        marginTop: 8,
                        fontSize: 18,
                        textDecoration: "underline",
                        marginBottom: 12,
                      }}
                    >
                      Chưa làm
                    </Typography>
                    <TaskList
                      curTaskList={tasksToDo}
                      status={"toDo"}
                      type={"card"}
                      isDragging={isDraggingId}
                    />
                  </PerfectScrollbar>

                  <PerfectScrollbar
                    style={{
                      background: "#f1f3f9",
                      width: 300,
                      maxHeight: 700,
                      display: "flex",
                      marginRight: 12,
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      style={{
                        marginTop: 8,
                        fontSize: 18,
                        textDecoration: "underline",
                        marginBottom: 12,
                      }}
                    >
                      Đang làm
                    </Typography>
                    <TaskList
                      curTaskList={tasksDoing}
                      status={"doing"}
                      type={"card"}
                      isDragging={isDraggingId}
                    />
                  </PerfectScrollbar>

                  <PerfectScrollbar
                    style={{
                      width: 300,
                      background: "#f1f3f9",
                      maxHeight: 700,
                      marginRight: 12,
                      display: "flex",
                      overflowY: "scroll",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      style={{
                        marginTop: 8,
                        fontSize: 18,
                        textDecoration: "underline",
                        marginBottom: 12,
                      }}
                    >
                      Chờ duyệt
                    </Typography>
                    <TaskList
                      curTaskList={tasksReviewing}
                      status={"reviewing"}
                      type={"card"}
                      isDragging={isDraggingId}
                    />
                  </PerfectScrollbar>

                  <PerfectScrollbar
                    style={{
                      width: 300,
                      background: "#f1f3f9",
                      maxHeight: 700,
                      display: "flex",
                      overflowY: "scroll",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      style={{
                        marginTop: 8,
                        fontSize: 18,
                        textDecoration: "underline",
                        marginBottom: 12,
                      }}
                    >
                      Hoàn thành
                    </Typography>
                    <TaskList
                      curTaskList={tasksDone}
                      status={"done"}
                      type={"card"}
                      isDragging={isDraggingId}
                    />
                  </PerfectScrollbar>
                </Box>
              </PerfectScrollbar>
            </DragDropContext>
          </Box>
        </Box>
      </LeftSideBar>

      <TaskDetailDialog
        task={currentTask}
        open={!!currentTask}
        onClose={() => setCurrentTask(undefined)}
      />

      <ExportDocxDialog
        open={openExportDocxDialog}
        onClose={() => setOpenExportDocxDialog(false)}
        onConfirm={(data) => {
          exportTasksToWord(
            {
              ...data,
              tasks: tasks.map((task) => ({
                title: task.title,
                content: task.content || "",
                status: task.status,
                assignee_id: task.assignee_id,
                creator_id: task.creator_id,
                created_at: task.created_at,
                deadline: task.deadline || "",
                last_edit: task.last_edit || "",
                room: "TODO",
              })),
            },
            (data.fileName || "output") + ".docx"
          );
        }}
      />
    </>
  );
};

export default WorkPage;
