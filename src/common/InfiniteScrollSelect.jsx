import useGetData from "@/api/useGetData";
import { Form, Select, Spin } from "antd";
import { useEffect, useState } from "react";

const InfiniteScrollSelect = ({
  module,
  placeholder,
  showSearch = true,
  label,
  onChange,
  labelName,
  value,
  isRequired,
  name,
  onBlur,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const {
    data,
    loading,
    loadMoreData,
    loadingMoreData,
    getData,
    setPagination,
  } = useGetData({ route: `${module}/list`, notLoadData: true, disableUrlParam: true });

  // Load options
  useEffect(() => {
    setPagination({ page: 1, limit: 10, pageNo: 1 });
    getData({
      route: `${module}/list`,
      disableUrlParam: true,
      params: searchValue.length > 0 ? { [`${label}`]: searchValue } : {},
      onSuccess: (res, updateData) => {
        const { data } = res;
        const formatData = data?.result?.map((item) => ({
          ...item,
          value: item?._id,
          label: item?.[`${label}`],
        }));
        updateData({ newData: { result: formatData } });
      },
    });
  }, [searchValue]);

  const handleSearch = (value) => setSearchValue(value);

  const handleScroll = (e) => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
      loadMoreData();
    }
  };

  // Inject selected value into options if missing
  const optionsWithSelected =
    value && !data.find((item) => item._id === (value?._id || value))
      ? [
          {
            _id: value?._id || value, // support object or string
            [label]: value?.label || value?.name || value, // fallback
          },
          ...data,
        ]
      : data;

  // Remove duplicates based on _id
  const uniqueOptions = Array.from(
    new Map(optionsWithSelected.map((item) => [item._id, item])).values()
  );

  return (
    <Form.Item name={name} className="mb-0">
      <div className="flex flex-col gap-2">
        <label>
          {labelName} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Select
          allowClear
          onClear={() => {
            onChange(null);
            setSearchValue("");
          }}
          onBlur={() => {
            setSearchValue("");
            if (onBlur) onBlur();
          }}
          onSearch={handleSearch}
          style={{
            minWidth: "200px",
            width: "100%",
            height: "40px",
            marginBottom: 0,
          }}
          className="rounded-xl border border-[var(--border-primary-color)] overflow-hidden"
          showSearch={showSearch}
          placeholder={placeholder}
          virtual
          onChange={(val, option) => {
            // Pass only _id to onChange (Formik)
            if (onChange) {
              onChange(val);
            }
          }}
          onPopupScroll={handleScroll}
          value={value?._id || value}
          loading={loading}
          filterOption={false}
          notFoundContent={loading || loadingMoreData ? <Spin size="small" /> : "No data"}
          options={[
            ...uniqueOptions.map((item) => ({
              label: item[label] || item.name || item.value || item._id,
              value: item._id,
            })),
            ...(loadingMoreData
              ? [
                  {
                    label: <Spin size="small" />,
                    value: "__loading",
                    disabled: true,
                  },
                ]
              : []),
          ]}
        />
      </div>
    </Form.Item>
  );
};

export default InfiniteScrollSelect;
