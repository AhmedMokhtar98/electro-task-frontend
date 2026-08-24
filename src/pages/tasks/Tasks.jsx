import { useState } from "react";
import SearchControls from "@/components/searchControls";
import useGetData from "@/api/useGetData";
import CreateForm from "./CreateForm";
import TaskBoard from "@/components/task/TaskBoard";
import TaskBoardHeader from "@/components/task/TaskBoardHeader";

const Tasks = () => {
  const { data: tasks, loading, count, setData: setTasks, setCount, getData, } = useGetData({ route: "tasks", });
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const reloadTasks = () => getData({});

  const closeForm = () => {
    setFormOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="relative min-h-full overflow-hidden px-4 py-5  sm:px-6 sm:py-7 lg:px-8">
      <div className="relative mx-auto max-w-[1600px]">

        <TaskBoardHeader onAddTask={() => { setSelectedTask(null); setFormOpen(true); }} />

        <SearchControls loading={loading} total={count} />

        <TaskBoard
          loading={loading}
          setTasks={setTasks}
          tasks={tasks}
          onDeleted={() => setCount((current) => Math.max(current - 1, 0))}
          onEdit={(task) => {
            setSelectedTask(task);
            setFormOpen(true);
          }}
        />

        <CreateForm
          open={formOpen}
          task={selectedTask}
          onClose={closeForm}
          onSaved={reloadTasks}
        />
      </div>
    </div>
  );
};

export default Tasks;
