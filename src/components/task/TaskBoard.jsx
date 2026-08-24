import { useState } from "react";
import { Modal } from "antd";
import useDeleteData from "@/api/useDeleteData";
import TaskCard from "./TaskCard";
import TaskColumn from "./TaskColumn";
import TaskDndContext from "./TaskDndContext";

const TASK_COLUMNS = ["To Do", "In Progress", "Done"];

const TaskBoard = ({ tasks = [], setTasks, loading, onEdit, onDeleted }) => {
  const { deleteData, loading: deleteLoading } = useDeleteData();
  const [taskToDelete, setTaskToDelete] = useState(null);

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    const response = await deleteData({
      route: `tasks/${taskToDelete._id}`,
    });

    if (response?.error) return;

    setTasks((currentTasks) =>
      currentTasks.filter(
        (currentTask) => currentTask._id !== taskToDelete._id,
      ),
    );
    onDeleted();
    setTaskToDelete(null);
  };

  return (
    <>
      <TaskDndContext
        renderOverlay={(task) => <TaskCard isOverlay task={task} />}
        setTasks={setTasks}
        tasks={tasks}
      >
        {({ tasksByColumn, activeDropColumn, savingOrder, }) => (
          <div className="grid gap-5 xl:grid-cols-3">
            {TASK_COLUMNS.map((status) => (
              <TaskColumn
                key={status}
                activeDropColumn={activeDropColumn}
                deleteLoading={deleteLoading}
                draggingDisabled={savingOrder}
                loading={loading}
                status={status}
                tasks={tasksByColumn[status]}
                onDelete={setTaskToDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </TaskDndContext>

      <Modal
        centered
        confirmLoading={deleteLoading}
        okButtonProps={{ danger: true }}
        okText="Delete"
        open={Boolean(taskToDelete)}
        title="Delete task?"
        onCancel={() => {
          if (!deleteLoading) setTaskToDelete(null);
        }}
        onOk={confirmDelete}
      >
        <p>
          “{taskToDelete?.title}” will be permanently deleted.
        </p>
      </Modal>
    </>
  );
};

export default TaskBoard;
