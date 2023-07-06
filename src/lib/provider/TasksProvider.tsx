import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { createContext, useCallback, useContext, useState } from "react";
import TaskData from "../../modules/task/interface/task-data";
import { db } from "../config/firebase-config";
import useAppSnackbar from "../hook/useAppSnackBar";
import FileData from "../interface/file-data";
import CommentData from "../interface/comment-data";
import { useUser } from "./UserProvider";
import TaskHelper from "../../modules/task/util/task-helper";

interface TasksContextProps {
  tasks: TaskData[];
  getTasks: (payload: { room_id: string }) => Promise<void>;
  loadingTasks: boolean;

  currentTask?: TaskData;
  setCurrentTask: (task?: TaskData) => void;

  createTask: (payload: {
    room_id: string;
    new_task: {
      title: string;
      assignee_id: string;
      content?: string;
      attach_files?: FileData[];
      comments?: CommentData[];
      status?: string;
      deadline?: Timestamp | Date | string;
    };
  }) => Promise<void>;
  creatingTask: boolean;

  updateTask: (payload: {
    room_id: string;
    id: string;
    updateData: {
      status: "toDo" | "doing" | "reviewing" | "done";
      order_value?: string;
      assignee_id?: string;
      deadline?: Timestamp | Date | string;
      content?: string;
      title?: string;
    };
  }) => Promise<void>;
  updatingTask: boolean;

  deleteTask: (payload: { room_id: string; id: string }) => Promise<void>;
  deletingTask: boolean;
}

const TasksContext = createContext<TasksContextProps>({
  tasks: [],

  getTasks: async () => {},
  loadingTasks: false,

  currentTask: {
    id: "",
    title: "",
    order_value: "",
    status: "toDo",
    assignee_id: "",
    creator_id: "",
    created_at: "",
  },
  setCurrentTask: () => {},

  createTask: async () => {},
  creatingTask: false,

  updateTask: async () => {},
  updatingTask: false,

  deleteTask: async () => {},
  deletingTask: false,
});

interface TasksContextProviderProps {
  children: React.ReactNode;
}

const TasksProvider = ({ children }: TasksContextProviderProps) => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [currentTask, setCurrentTask] = useState<TaskData>();
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);

  const { showSnackbarError } = useAppSnackbar();
  const { user } = useUser();

  const getTasks = useCallback(
    async ({ room_id }: { room_id: string }) => {
      try {
        setLoadingTasks(true);
        onSnapshot(collection(db, "room", room_id, "task"), (taskDocs) => {
          setTasks(taskDocs.docs.map((taskDoc) => taskDoc.data() as TaskData));
        });
      } catch (error) {
        showSnackbarError(error);
      } finally {
        setLoadingTasks(false);
      }
    },
    [showSnackbarError]
  );

  const createTask = useCallback(
    async ({
      room_id,
      new_task,
    }: {
      room_id: string;
      new_task: {
        title: string;
        assignee_id?: string;
        content?: string;
        deadline?: Timestamp | Date | string;
        attach_files?: FileData[];
        comments?: CommentData[];
        status?: string;
      };
    }) => {
      if (!user?.id) return;
      try {
        setCreatingTask(true);
        const time = Timestamp.now();
        const minOrderTask = tasks
          .filter((task) => task.status === "toDo")
          .sort((taskA, taskB) =>
            taskA.order_value >= taskB.order_value ? 1 : -1
          )[0];
        const docResponse = await addDoc(
          collection(db, "room", room_id, "task"),
          {
            status: "toDo",
            creator_id: user?.id,
            order_value: TaskHelper.getOrderString(
              "",
              minOrderTask ? minOrderTask.order_value : ""
            ),
            created_at: time,
            last_edit: time,
            ...new_task,
          }
        );
        await updateDoc(doc(db, "room", room_id, "task", docResponse.id), {
          id: docResponse.id,
        });
        const newTask = {
          status: "toDo",
          id: docResponse.id,
          order_value: TaskHelper.getOrderString(
            "",
            minOrderTask ? minOrderTask.order_value : ""
          ),
          creator_id: user?.id,
          created_at: time,
          last_edit: time,
          ...new_task,
        };

        if (newTask.assignee_id) {
          const memberDocs = await getDocs(
            query(
              collection(db, "room", room_id, "member"),
              where("id", "==", newTask.assignee_id)
            )
          );

          await runTransaction(db, async (transaction) => {
            transaction.update(
              doc(db, "room", room_id, "member", memberDocs.docs[0].id),
              {
                [newTask.status]: memberDocs.docs[0].data()[newTask.status] + 1,
              }
            );
          });
        }

        // setTasks([newTask as TaskData, ...tasks]);
      } catch (error) {
        showSnackbarError(error);
      } finally {
        setCreatingTask(false);
      }
    },
    [showSnackbarError, tasks, user?.id]
  );

  const updateTask = useCallback(
    async ({
      room_id,
      id,
      updateData,
    }: {
      room_id: string;
      id: string;
      updateData: {
        status: "toDo" | "doing" | "reviewing" | "done";
        order_value?: string;
        assignee_id?: string;
        deadline?: Timestamp | Date | string;
        content?: string;
        title?: string;
      };
    }) => {
      try {
        const time = Timestamp.now();
        setUpdatingTask(true);

        // setTasks(
        //   tasks.map((task) => {
        //     if (task.id === id) {
        //       return {
        //         last_edit: time,
        //         ...task,
        //         ...updateData,
        //       };
        //     }

        //     return task;
        //   })
        // );

        const taskBeforeDoc = await getDoc(
          doc(db, "room", room_id, "task", id)
        );

        if (taskBeforeDoc.data()?.assignee_id) {
          const memberHoldTaskDocs = await getDocs(
            query(
              collection(db, "room", room_id, "member"),
              where("id", "==", taskBeforeDoc.data()?.assignee_id)
            )
          );
          if (memberHoldTaskDocs.docs.length > 0) {
            await runTransaction(db, async (transaction) => {
              transaction.update(
                doc(
                  db,
                  "room",
                  room_id,
                  "member",
                  memberHoldTaskDocs.docs[0].id
                ),
                {
                  [taskBeforeDoc.data()?.status]:
                    memberHoldTaskDocs.docs[0].data()[
                      taskBeforeDoc.data()?.status
                    ] - 1,
                }
              );
            });
          }
        }

        await updateDoc(doc(db, "room", room_id, "task", id), {
          last_edit: time,
          order_value: TaskHelper.getOrderString(
            "",
            tasks
              .filter(
                (task) => task.status === updateData.status && task.id !== id
              )
              .sort((taskA, taskB) =>
                taskA.order_value > taskB.order_value ? -1 : 1
              )[0]?.order_value ?? ""
          ),
          ...updateData,
        });

        const taskAfter = {
          ...taskBeforeDoc.data(),
          last_edit: time,
          ...updateData,
        };

        const memberAssigneeTaskDocs = await getDocs(
          query(
            collection(db, "room", room_id, "member"),
            where(
              "id",
              "==",
              updateData.assignee_id || taskBeforeDoc.data()?.assignee_id
            )
          )
        );

        if (memberAssigneeTaskDocs.docs.length > 0)
          await runTransaction(db, async (transaction) => {
            transaction.update(
              doc(
                db,
                "room",
                room_id,
                "member",
                memberAssigneeTaskDocs.docs[0].id
              ),
              {
                [taskAfter.status || "error"]:
                  memberAssigneeTaskDocs.docs[0].data()[
                    taskAfter.status || "error"
                  ] + 1,
              }
            );
          });
      } catch (error) {
        showSnackbarError(error);
      } finally {
        setUpdatingTask(false);
      }
    },
    [showSnackbarError]
  );

  const deleteTask = useCallback(
    async ({ room_id, id }: { room_id: string; id: string }) => {
      try {
        setDeletingTask(true);

        // setTasks(tasks.filter((task) => task.id !== id));

        const taskDoc = await getDoc(doc(db, "room", room_id, "task", id));
        const memberHoldTaskDocs = await getDocs(
          query(
            collection(db, "room", room_id, "member"),
            where("id", "==", taskDoc.data()?.assignee_id)
          )
        );
        if (memberHoldTaskDocs.docs.length) {
          await runTransaction(db, async (transaction) => {
            transaction.update(
              doc(db, "room", room_id, "member", memberHoldTaskDocs.docs[0].id),
              {
                [taskDoc.data()?.status]:
                  memberHoldTaskDocs.docs[0].data()[taskDoc.data()?.status] - 1,
              }
            );
          });
        }

        await deleteDoc(doc(db, "room", room_id, "task", id));

        setCurrentTask({} as TaskData);
      } catch (error) {
        showSnackbarError(error);
      } finally {
        setDeletingTask(false);
      }
    },
    [showSnackbarError]
  );

  return (
    <TasksContext.Provider
      value={{
        tasks,

        getTasks,
        loadingTasks,

        currentTask,
        setCurrentTask,

        createTask,
        creatingTask,

        updateTask,
        updatingTask,

        deleteTask,
        deletingTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const store = useContext(TasksContext);
  return store;
};

export default TasksProvider;
