import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./search/SearchBar";
import RangeDate from "./date/RangeDate";
import DateComponent from "./date/Date";
import CreateButton from "@/common/CreateButton";
import { Select, Drawer, Button, Tag, Badge } from "antd";
import Sort from "./sort/Sort";
import Filter from "./filter/Filter";
import { FiFilter } from "react-icons/fi";
import { MdClear } from "react-icons/md";

export default function SearchControls({
  setData,
  Options,
  filterOptions,
  sortOptions,
  dateFields,
  model,
  title,
  createNavigation,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [type, setType] = useState(Options ? Options[0] : "");
  const [date, setDate] = useState(undefined);
  const [rangeDate, setRangeDate] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const path = location.pathname.substring(1) || " ";

  const urlParams = new URLSearchParams(location.search);
  const urlDateField = urlParams.get("dateField");
  const [selectedDateField, setSelectedDateField] = useState(
    urlDateField ||
      (dateFields && dateFields.length > 0 ? dateFields[0].value : "")
  );

  useEffect(() => {
    updateActiveFilters();
  }, [location.search]);

  const updateActiveFilters = () => {
    const params = new URLSearchParams(location.search);
    const filters = [];

    // Search filter
    if (params.get(type)) {
      filters.push({
        key: type,
        label: `Search: ${params.get(type)}`,
        value: params.get(type),
      });
    }

    // Regular filters
    if (filterOptions) {
      filterOptions.forEach((filter) => {
        const value = params.get(filter);
        if (value === "true") {
          filters.push({
            key: filter,
            label: `${filter}: Yes`,
            value: "Yes",
          });
        } else if (value === "false") {
          filters.push({
            key: filter,
            label: `${filter}: No`,
            value: "No",
          });
        }
      });
    }

    // Sort filter
    if (sortOptions && params.get("sort")) {
      const sortValue = params.get("sort");
      const isDescending = sortValue.startsWith("-");
      const field = isDescending ? sortValue.substring(1) : sortValue;
      const direction = isDescending ? "Descending" : "Ascending";

      const sortOption = sortOptions.find((opt) => opt.value === field);
      if (sortOption) {
        filters.push({
          key: "sort",
          label: `Sort: ${sortOption.label} (${direction})`,
          value: `${field}-${direction}`,
        });
      }
    }

    // Date filters
    if (dateFields && dateFields.length > 0) {
      const dateField = params.get("dateField");
      const dateFrom = params.get("dateFrom");
      const dateTo = params.get("dateTo");

      if (dateFrom && !dateTo) {
        const fieldLabel =
          dateFields.find((f) => f.value === dateField)?.label || dateField;
        filters.push({
          key: "date",
          label: `${fieldLabel}: ${dateFrom}`,
          value: `date-${dateFrom}`,
        });
      } else if (dateFrom && dateTo) {
        const fieldLabel =
          dateFields.find((f) => f.value === dateField)?.label || dateField;
        filters.push({
          key: "dateRange",
          label: `${fieldLabel}: ${dateFrom} to ${dateTo}`,
          value: `dateRange-${dateFrom}-${dateTo}`,
        });
      }
    }

    setActiveFilters(filters);
  };

  const handleDateFieldChange = (value) => {
    setSelectedDateField(value);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("dateField", value);
    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    navigate(newUrl, { replace: true });
    setDate(undefined);
    setRangeDate([]);
  };

  const clearAllFilters = () => {
    const queryParams = new URLSearchParams(location.search);

    // Clear search parameter (dynamic based on type)
    queryParams.delete(type);

    // Clear filter-related parameters only
    if (filterOptions) {
      filterOptions.forEach((filter) => {
        queryParams.delete(filter);
      });
    }

    // Clear sort parameter
    queryParams.delete("sort");

    // Clear date-related parameters
    queryParams.delete("dateField");
    queryParams.delete("dateFrom");
    queryParams.delete("dateTo");

    // Clear any other date parameters that might exist
    Array.from(queryParams.keys())
      .filter((key) => key.startsWith("date"))
      .forEach((key) => queryParams.delete(key));

    // Navigate with the updated parameters
    navigate(`${location.pathname}?${queryParams.toString()}`, {
      replace: true,
    });

    // Reset local state
    setDate(undefined);
    setRangeDate([]);
    if (dateFields && dateFields.length > 0) {
      setSelectedDateField(dateFields[0].value);
    }
    setActiveFilters([]);
  };

  const removeFilter = (filter) => {
    const queryParams = new URLSearchParams(location.search);

    if (filter.key === type) {
      // Search filter
      queryParams.delete(filter.key);
    } else if (filterOptions && filterOptions.includes(filter.key)) {
      // Regular filter
      queryParams.delete(filter.key);
    } else if (filter.key === "sort") {
      // Sort filter
      queryParams.delete("sort");
    } else if (filter.key === "date" || filter.key === "dateRange") {
      // Date filters
      queryParams.delete("dateField");
      queryParams.delete("dateFrom");
      queryParams.delete("dateTo");
      setDate(undefined);
      setRangeDate([]);
    }

    navigate(`${location.pathname}?${queryParams.toString()}`, {
      replace: true,
    });
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  return (
    <div className="flex flex-col gap-3 w-full my-3 bg-[var(--bg-primary-color)] px-6 py-2 rounded-3xl">
      {/* Top row with search and create button */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          {Options && (
            <div className="flex items-center gap-3 flex-1">
              <SearchBar
                type={type}
                setType={setType}
                setPagination
                path={path}
                setData={setData}
                Options={Options}
              />
            </div>
          )}
          {(filterOptions || sortOptions || dateFields) && (
            <Badge count={activeFilters.length} offset={[-5, 5]} size="small">
              <Button
                type="default"
                className="h-[40px] flex items-center gap-2"
                onClick={showDrawer}
              >
                <FiFilter />
                Filters
              </Button>
            </Badge>
          )}
        </div>

        {!(model === "notifications" || model === "payment-history") && (
          <CreateButton
            createNavigation={createNavigation}
            model={model}
            title={title}
          />
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-[var(--bg-third-color)] border border-[var(--border-primary-color)] rounded-lg">
          <span className="text-sm">Active filters:</span>
          {activeFilters.map((filter) => (
            <Tag
              key={filter.value}
              closable
              onClose={() => removeFilter(filter)}
              className="flex items-center gap-1 border border-[var(--border-primary-color)] !bg-[var(--bg-primary-color)]"
            >
              {filter.label}
            </Tag>
          ))}
          <Button
            type="text"
            size="small"
            onClick={clearAllFilters}
            className="text-red-500 flex items-center gap-1"
          >
            <MdClear />
            Clear all
          </Button>
        </div>
      )}

      {/* Drawer for filters */}
      <Drawer
        title="Filters"
        placement="right"
        onClose={onClose}
        open={drawerVisible}
        width={400}
        extra={
          <Button
            type="text"
            size="small"
            onClick={() => {
              clearAllFilters();
              onClose();
            }}
            className="text-red-500 flex items-center gap-1"
          >
            <MdClear />
            Clear all
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          {filterOptions && (
            <div className="border-b pb-4">
              <h3 className="font-medium mb-3">Filters</h3>
              <Filter
                setPagination
                setData={setData}
                path={path}
                Options={filterOptions}
              />
            </div>
          )}

          {sortOptions && (
            <div className="border-b pb-4">
              <h3 className="font-medium mb-3">Sort By</h3>
              <Sort sortOptions={sortOptions} />
            </div>
          )}

          {dateFields && dateFields.length > 0 && (
            <div className="border-b pb-4">
              <h3 className="font-medium mb-3">Date Range</h3>
              <div className="flex flex-col gap-4">
                <Select
                  className="w-full"
                  value={selectedDateField}
                  onChange={handleDateFieldChange}
                >
                  {dateFields.map((field) => (
                    <Select.Option key={field.value} value={field.value}>
                      {field.label}
                    </Select.Option>
                  ))}
                </Select>

                <div className="flex flex-col gap-2">
                  <label className="text-sm">Single Date</label>
                  <DateComponent
                    date={date}
                    setDate={setDate}
                    setRangeDate={setRangeDate}
                    dateField={selectedDateField}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm">Date Range</label>
                  <RangeDate
                    date={date}
                    setDate={setDate}
                    rangeDate={rangeDate}
                    setRangeDate={setRangeDate}
                    dateField={selectedDateField}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
