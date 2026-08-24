export const initialFilters = {
  search: "",
  status: "",
  priority: "",
  dueDate: "",
  sortBy: "position",
  sortOrder: "asc",
  page: 1,
  limit: 9,
};

export const statusOptions = [
  { label: "All statuses", value: "" },
  { label: "To Do", value: "To Do" },
  { label: "In Progress", value: "In Progress" },
  { label: "Done", value: "Done" },
];

export const priorityOptions = [
  { label: "All priorities", value: "" },
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const sortOptions = [
  { label: "Custom order", value: "position:asc" },
  { label: "Newest first", value: "createdAt:desc" },
  { label: "Oldest first", value: "createdAt:asc" },
  { label: "Due date: earliest", value: "dueDate:asc" },
  { label: "Due date: latest", value: "dueDate:desc" },
  { label: "Title: A–Z", value: "title:asc" },
  { label: "Title: Z–A", value: "title:desc" },
];

