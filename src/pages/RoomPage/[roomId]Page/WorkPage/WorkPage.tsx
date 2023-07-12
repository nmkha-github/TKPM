import React, { useEffect, useState } from "react";
import LeftSideBar from "../../../../modules/room/components/LeftSideBar/LeftSideBar";
import { useRooms } from "../../../../lib/provider/RoomsProvider";
import { useParams } from "react-router-dom";
import TaskData from "../../../../modules/task/interface/task-data";
import TaskDetailDialog from "../../../../modules/task/components/TaskDetailDialog/TaskDetailDialog";
import TaskList from "../../../../modules/task/components/TaskList/TaskList";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useTasks } from "../../../../lib/provider/TasksProvider";
import { Box, Button, IconButton, Typography } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";
import CreateTaskDialog from "../../../../modules/task/components/CreateTaskDialog/CreateTaskDialog";
import TaskHelper from "../../../../modules/task/util/task-helper";
import ShowMenuButton from "../../../../lib/components/ShowMenuButton/ShowMenuButton";
import { BiArrowFromLeft, BiArrowFromRight, BiPlus, BiX } from "react-icons/bi";
import TaskStatusData from "../../../../modules/task/interface/task-status-data";

const WorkPage = () => {
  const { getCurrentRoom, currentRoom } = useRooms();
  const { roomId } = useParams();
  const {
    taskStatuses,
    getTaskStatuses,
    createTaskStatus,
    deleteTaskStatus,
    deletingTaskStatus,
    updateTaskStatus,
    updatingTaskStatus,

    tasks,
    setTasks,
    getTasks,
    updateTask,
    updatingTask,
    currentTask,
    setCurrentTask,
  } = useTasks();
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [hoverTitleTaskList, setHoverTitleTaskList] = useState("");
  const [isDraggingId, setIsDraggingId] = useState("-1");

  useEffect(() => {
    getCurrentRoom(roomId || "");
  }, [roomId]);

  useEffect(() => {
    if (currentRoom) {
      getTasks({ room_id: roomId || "" });
      getTaskStatuses({ room_id: roomId || "" });
    }
  }, [currentRoom]);

  const compareTasks = (TaskA: TaskData, TaskB: TaskData) => {
    if (TaskA.order_value >= TaskB.order_value) {
      return 1;
    }
    return -1;
  };

  function handleOnDragStart(result: DragStart) {
    setIsDraggingId(tasks[result.source.index].id);
  }

  const handleOnDragEnd = async (result: DropResult) => {
    setIsDraggingId("-1");
    if (!result.destination) return;

    const taskDestinitionList = tasks
      .filter(
        (task) =>
          task.status ===
          taskStatuses.find(
            (status) =>
              status.task_status_id === result.destination?.droppableId
          )?.name
      )
      .sort(compareTasks);

    const updateData = {
      status:
        taskStatuses.find(
          (status) => status.task_status_id === result.destination?.droppableId
        )?.name || "",
      order_value: TaskHelper.getOrderString(
        taskDestinitionList[result.destination.index - 1]?.order_value ?? "",
        taskDestinitionList[result.destination.index + 1]?.order_value ?? ""
      ),
    };

    setTasks(tasks.filter((task) => task.id !== result.draggableId));

    await updateTask({
      room_id: roomId ? roomId : "",
      id: result.draggableId,
      updateData: updateData,
    });

    // if (result.source.droppableId === "toDo") {
    //   dragTask = tasksToDo.at(result.source.index);
    //   tasksToDo.splice(result.source.index, 1);
    //   setTasksToDo(tasksToDo);
    // } else if (result.source.droppableId === "doing") {
    //   dragTask = tasksDoing.at(result.source.index);
    //   tasksDoing.splice(result.source.index, 1);
    //   setTasksDoing(tasksDoing);
    // } else if (result.source.droppableId === "reviewing") {
    //   dragTask = tasksReviewing.at(result.source.index);
    //   tasksReviewing.splice(result.source.index, 1);
    //   setTasksReviewing(tasksReviewing);
    // } else {
    //   dragTask = tasksDone.at(result.source.index);
    //   tasksDone.splice(result.source.index, 1);
    //   setTasksDone(tasksDone);
    // }

    // if (result.destination.droppableId === "toDo") {
    //   if (dragTask) {
    //     tasksToDo.splice(result.destination.index, 0, dragTask);
    //     setTasksToDo(tasksToDo);
    //     await updateTask({
    //       room_id: roomId ? roomId : "",
    //       id: result.draggableId,
    //       updateData: {
    //         status: "toDo",
    //         order_value: TaskHelper.getOrderString(
    //           tasksToDo[tasksToDo.indexOf(dragTask) - 1]?.order_value ?? "",
    //           tasksToDo[tasksToDo.indexOf(dragTask) + 1]?.order_value ?? ""
    //         ),
    //       },
    //     });
    //   }
    // } else if (result.destination.droppableId === "doing") {
    //   if (dragTask) {
    //     tasksDoing.splice(result.destination.index, 0, dragTask);
    //     setTasksDoing(tasksDoing);
    //     await updateTask({
    //       room_id: roomId ? roomId : "",
    //       id: result.draggableId,
    //       updateData: {
    //         status: "doing",
    //         order_value: TaskHelper.getOrderString(
    //           tasksDoing[tasksDoing.indexOf(dragTask) - 1]?.order_value ?? "",
    //           tasksDoing[tasksDoing.indexOf(dragTask) + 1]?.order_value ?? ""
    //         ),
    //       },
    //     });
    //   }
    // } else if (result.destination.droppableId === "reviewing") {
    //   if (dragTask) {
    //     tasksReviewing.splice(result.destination.index, 0, dragTask);
    //     setTasksReviewing(tasksReviewing);
    //     await updateTask({
    //       room_id: roomId ? roomId : "",
    //       id: result.draggableId,
    //       updateData: {
    //         status: "reviewing",
    //         order_value: TaskHelper.getOrderString(
    //           tasksReviewing[tasksReviewing.indexOf(dragTask) - 1]
    //             ?.order_value ?? "",
    //           tasksReviewing[tasksReviewing.indexOf(dragTask) + 1]
    //             ?.order_value ?? ""
    //         ),
    //       },
    //     });
    //   }
    // } else if (result.destination.droppableId === "done") {
    //   if (dragTask) {
    //     tasksDone.splice(result.destination.index, 0, dragTask);
    //     setTasksDone(tasksDone);
    //     await updateTask({
    //       room_id: roomId ? roomId : "",
    //       id: result.draggableId,
    //       updateData: {
    //         status: "done",
    //         order_value: TaskHelper.getOrderString(
    //           tasksDone[tasksDone.indexOf(dragTask) - 1]?.order_value ?? "",
    //           tasksDone[tasksDone.indexOf(dragTask) + 1]?.order_value ?? ""
    //         ),
    //       },
    //     });
    //   }
    // }
  };

  return (
    <>
      <LeftSideBar>
        <Box
          style={{
            display: "flex",
            height: "calc(100vh - 66px)",
            flexDirection: "column",
          }}
        >
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
                itemsAction={[() => {}, () => {}, () => {}]}
                tooltipTitle="Xuất tất cả công việc"
              />
            </Box>
          </Box>

          <PerfectScrollbar
            style={{
              marginTop: 16,
              marginLeft: 8,
              display: "flex",
            }}
          >
            <Box
              style={{
                maxHeight: 560,
                display: "flex",
              }}
            >
              <DragDropContext
                onDragEnd={handleOnDragEnd}
                onDragStart={handleOnDragStart}
              >
                {taskStatuses
                  .sort((statusA: TaskStatusData, statusB: TaskStatusData) =>
                    statusA.order < statusB.order ? -1 : 1
                  )
                  .map((taskStatus, index) => (
                    <PerfectScrollbar
                      style={{
                        background: "#f1f3f9",
                        marginRight: 12,
                        width: 300,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        onMouseEnter={() =>
                          setHoverTitleTaskList(taskStatus.task_status_id)
                        }
                        onMouseLeave={() => setHoverTitleTaskList("")}
                        style={{
                          width: "100%",
                          height: 52,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {hoverTitleTaskList === taskStatus.task_status_id && (
                          <Box
                            style={{
                              position: "absolute",
                              left: 0,
                              display: "flex",
                            }}
                          >
                            <IconButton
                              disabled={index === 0}
                              onClick={async () =>
                                await Promise.all([
                                  updateTaskStatus({
                                    room_id: roomId ?? "",
                                    task_status_id: taskStatus.task_status_id,
                                    updateData: { order: taskStatus.order - 1 },
                                  }),
                                  updateTaskStatus({
                                    room_id: roomId ?? "",
                                    task_status_id:
                                      taskStatuses[index - 1].task_status_id,
                                    updateData: {
                                      order: taskStatuses[index - 1].order + 1,
                                    },
                                  }),
                                ])
                              }
                            >
                              <BiArrowFromRight />
                            </IconButton>

                            <IconButton
                              disabled={index === taskStatuses.length - 1}
                              onClick={async () =>
                                await Promise.all([
                                  updateTaskStatus({
                                    room_id: roomId ?? "",
                                    task_status_id: taskStatus.task_status_id,
                                    updateData: { order: taskStatus.order + 1 },
                                  }),
                                  updateTaskStatus({
                                    room_id: roomId ?? "",
                                    task_status_id:
                                      taskStatuses[index + 1].task_status_id,
                                    updateData: {
                                      order: taskStatuses[index + 1].order - 1,
                                    },
                                  }),
                                ])
                              }
                            >
                              <BiArrowFromLeft />
                            </IconButton>
                          </Box>
                        )}
                        <Typography
                          style={{
                            fontSize: 18,
                            textDecoration: "underline",
                            cursor:
                              hoverTitleTaskList === taskStatus.task_status_id
                                ? "pointer"
                                : "default",
                          }}
                        >
                          {taskStatus.name}
                        </Typography>

                        {hoverTitleTaskList === taskStatus.task_status_id && (
                          <IconButton
                            style={{ position: "absolute", right: 0 }}
                            onClick={async () =>
                              await deleteTaskStatus({
                                room_id: roomId ?? "",
                                task_status_id: taskStatus.task_status_id,
                              })
                            }
                          >
                            <BiX />
                          </IconButton>
                        )}
                      </Box>
                      <TaskList
                        curTaskList={tasks
                          .filter((task) => task.status === taskStatus.name)
                          .sort(compareTasks)}
                        status={taskStatus.task_status_id}
                        type={"card"}
                        isDragging={isDraggingId}
                      />
                    </PerfectScrollbar>
                  ))}
                <Box
                  style={{
                    height: 24,
                    width: 24,
                    borderRadius: 8,
                    background: "#d8f9ff",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={async () =>
                    await createTaskStatus({
                      room_id: roomId ?? "",
                      new_task_status: {
                        name: "Process " + (taskStatuses.length + 1),
                        order: taskStatuses.length,
                      },
                    })
                  }
                >
                  <BiPlus />
                </Box>
                <Box style={{ width: 12 }} />
              </DragDropContext>
            </Box>
          </PerfectScrollbar>
        </Box>
      </LeftSideBar>

      <TaskDetailDialog
        task={currentTask}
        open={!!currentTask}
        onClose={() => setCurrentTask(undefined)}
      />
    </>
  );
};

export default WorkPage;
