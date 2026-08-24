import { DatePicker, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useEffect } from "react";

const { RangePicker } = DatePicker;

export default function RangeDate({
  setDate,
  rangeDate,
  setRangeDate,
  dateField,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDate = (v) => {
    if (v?.length) {
      const min = v[0];
      const max = v[1];
      setRangeDate(v);

      // First, let's get the current query parameters
      const queryParams = new URLSearchParams(location.search);

      clearAllDateParams(queryParams);

      queryParams.set("dateField", dateField);
      queryParams.set(`dateFrom`, min.format("YYYY-MM-DD"));
      queryParams.set(`dateTo`, max.format("YYYY-MM-DD"));

      const newUrl = `${location.pathname}?${queryParams.toString()}`;
      navigate(newUrl, { replace: true });

      setDate(undefined);
    } else {
      handleClear();
    }
  };

  const clearAllDateParams = (queryParams) => {
    queryParams.delete("date");

    const paramsToRemove = [];
    queryParams.forEach((value, key) => {
      if (key.includes("dateFrom") || key.includes("dateTo")) {
        paramsToRemove.push(key);
      }
    });

    paramsToRemove.forEach((param) => {
      queryParams.delete(param);
    });
  };

  const handleClear = () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("dateField");
    clearAllDateParams(queryParams);

    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    navigate(newUrl, { replace: true });
    setRangeDate([]);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const currentDateField = queryParams.get("dateField");

    if (currentDateField === dateField) {
      const dateFromUrl = queryParams.get(`dateFrom`);
      const dateToUrl = queryParams.get(`dateTo`);

      if (dateFromUrl && dateToUrl) {
        const d1 = dayjs(dateFromUrl).isValid()
          ? dayjs(dateFromUrl)
          : undefined;
        const d2 = dayjs(dateToUrl).isValid() ? dayjs(dateToUrl) : undefined;
        setRangeDate([d1, d2]);
      } else {
        setRangeDate([]);
      }
    } else {
      setRangeDate([]);
    }
  }, [dateField, location.search]);

  return (
    <Space direction="vertical" size={10}>
      <RangePicker
        className="h-[40px] border-[#A2A1A880] rounded-lg"
        value={rangeDate}
        onChange={handleDate}
        placeholder={[t("Start Date"), t("End Date")]}
      />
    </Space>
  );
}
