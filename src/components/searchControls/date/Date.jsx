import { DatePicker } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { CalendarOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "./date.css";
import { useEffect } from "react";

const DateComponent = ({ date, setDate, setRangeDate, dateField }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDate = (value, dateString) => {
    if (dateString) {
      const formattedDate = `${dayjs(dateString).format("YYYY-MM-DD")}`;
      const queryParams = new URLSearchParams(location.search);
      setDate(formattedDate);
      queryParams.set("page", 1);
      queryParams.set("dateField", dateField);
      queryParams.set("dateFrom", formattedDate);
      const newUrl = `${location.pathname}?${queryParams.toString()}`;
      navigate(newUrl, { replace: true });
      if (queryParams.get("dateTo")) {
        setRangeDate([]);
        queryParams.delete("dateTo");
        const newUrl = `${location.pathname}?${queryParams.toString()}`;
        navigate(newUrl, { replace: true });
      }
    } else {
      handleClear();
    }
  };
  const handleClear = () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("dateField");
    queryParams.delete("dateFrom");
    queryParams.delete("dateTo");
    Array.from(queryParams.keys())
      .filter((key) => key.startsWith("date"))
      .forEach((key) => queryParams.delete(key));
    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    navigate(newUrl, { replace: true });
    setDate(undefined);
  };

  // const getSearchData = async()=>{
  //   const res = await getData({ route: path.length>0 ? `${path}/list` : `list`,});
  //   if (!res?.error) { setData(res?.data?.result); };
  // }
  //useApiEffect(()=>{ if(date) { getSearchData() } },[date])
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const dateFromUrl_1 = queryParams.get("dateFrom");
    const dateFromUrl_2 = queryParams.get("dateTo");
    if (!(dateFromUrl_1 && dateFromUrl_2)) {
      setDate(
        dayjs(dateFromUrl_1).isValid()
          ? dayjs(dateFromUrl_1).format("YYYY-MM-DD")
          : undefined
      );
    } else {
      setDate(undefined);
    }
  }, []);

  return (
    <>
      <DatePicker
        className="h-[40px] border-[#A2A1A880] rounded-lg !m-0"
        value={date ? dayjs(date) : undefined}
        placeholder={date ? date : t("Date")}
        style={{ marginRight: 10 }}
        onChange={(date, dateString) => {
          handleDate(date, dateString);
        }}
        picker="date"
        suffixIcon={<CalendarOutlined style={{ cursor: "pointer" }} />}
      />
    </>
  );
};

export default DateComponent;
