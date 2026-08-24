import PropTypes from "prop-types";
import { Button } from "antd";
import { CheckSquare2, Plus } from "lucide-react";

const TaskBoardHeader = ({ onAddTask }) => (
  <header className="mb-6 overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-white via-white to-emerald-50/70 p-5 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.45)] dark:border-white/[0.07] dark:bg-[#171717]/90 dark:bg-none dark:backdrop-blur-sm sm:p-7">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
          <CheckSquare2 size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Personal workspace
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            My Tasks
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Plan your work, move priorities forward, and keep every task in
            view.
          </p>
        </div>
      </div>

      <Button
        className="!h-12 !rounded-2xl !border-emerald-600 !bg-emerald-600 !px-6 !font-semibold !text-white !shadow-lg !shadow-emerald-600/20 hover:!border-emerald-700 hover:!bg-emerald-700"
        icon={<Plus size={19} />}
        onClick={onAddTask}
      >
        Add task
      </Button>
    </div>
  </header>
);

TaskBoardHeader.propTypes = {
  onAddTask: PropTypes.func.isRequired,
};

export default TaskBoardHeader;
