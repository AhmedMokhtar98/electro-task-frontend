import { Button, Modal } from "antd";
import { Form, Formik } from "formik";
import { ListPlus, PencilLine } from "lucide-react";
import { TaskValidationSchema } from "@/utils/validationSchema";
import { getTodayDate, priorityOptions, statusOptions, } from "@/utils/helpers";
import AppInput from "@/common/AppInput";
import usePutData from "@/api/usePutData";
import usePostData from "@/api/usePostData";

const CreateForm = ({ open, task, onClose, onSaved }) => {
  const { putData, loading: putLoading } = usePutData();
  const { postData, loading: postLoading } = usePostData();
  const isEditing = Boolean(task?._id);
  const requestLoading = putLoading || postLoading;

  return (
    <Modal
      centered
      destroyOnClose
      footer={null}
      open={open}
      styles={{ content: { overflow: "hidden", padding: 0, }, }}
      title={null}
      width={620}
      onCancel={onClose}
    >
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/70 px-6 py-5 dark:border-slate-800 dark:from-slate-900 dark:to-emerald-950/30">
        <div className="flex items-center gap-3 pr-8">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            {isEditing ? <PencilLine size={20} /> : <ListPlus size={21} />}
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {isEditing ? "Update task" : "Create a new task"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {isEditing
                ? "Adjust the details and keep your board up to date."
                : "Add the details and start moving your work forward."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 dark:bg-slate-900">
        <Formik
          enableReinitialize
          initialValues={{
            title: task?.title || "",
            description: task?.description || "",
            status: task?.status || "To Do",
            priority: task?.priority || "Medium",
            dueDate: task?.dueDate ? String(task.dueDate).slice(0, 10) : getTodayDate(),
          }}
          validationSchema={TaskValidationSchema}
          onSubmit={async (values) => {
            const data = {
              ...values,
              dueDate: `${values.dueDate}T23:59:59.999Z`,
            };
            const response = isEditing
              ? await putData({ route: `tasks/${task._id}`, data })
              : await postData({ route: "tasks", data });

            if (response?.error) return;

            await onSaved();
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <AppInput
                is_required
                label="Title"
                name="title"
                placeholder="Enter task title"
                type="text"
              />

              <AppInput
                is_required
                label="Description"
                name="description"
                placeholder="Enter task description"
                rows={4}
                type="textArea"
              />

              <div className="grid gap-x-4 sm:grid-cols-2">
                <AppInput
                  is_required
                  label="Status"
                  name="status"
                  options={statusOptions}
                  placeholder="Select status"
                  type="select"
                />

                <AppInput
                  is_required
                  label="Priority"
                  name="priority"
                  options={priorityOptions}
                  placeholder="Select priority"
                  type="select"
                />
              </div>

              <AppInput
                is_required
                label="Due date"
                name="dueDate"
                type="date"
              />

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
                <Button
                  className="!h-11 !rounded-xl !border-slate-200 !px-5 !font-medium dark:!border-slate-700 dark:!text-slate-200"
                  disabled={isSubmitting || requestLoading}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="!h-11 !rounded-xl !border-emerald-600 !bg-emerald-600 !px-6 !font-semibold !text-white hover:!border-emerald-700 hover:!bg-emerald-700"
                  htmlType="submit"
                  loading={isSubmitting || requestLoading}
                  type="primary"
                >
                  {isEditing ? "Save changes" : "Create task"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default CreateForm;
