import { useState, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { GetService } from './services/requests-service';
import { paramsValidate } from '../utils/helpers';
import useApiEffect from '../hooks/useApiEffect';

const useGetData = ({ route, params, onSuccess, notLoadData, loadMoreMode, disableUrlParam, skippedQueryParamsKeys }) => {
    const [count, setCount] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMoreData, setLoadingMoreData] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, pageNo: 1 });

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const paramsObject = Object.fromEntries(urlParams.entries());

    const isFetchingRef = useRef(false);

    // ==== API Fetcher ====
    const getApi = async ({ params, loadMoreMode = false, disableUrlParam = false }) => {
        try {
            if (!loadMoreMode) setLoading(true);

            const validatedParams = paramsValidate( (loadMoreMode || disableUrlParam) ? params : { ...paramsObject, ...params } );
            if (skippedQueryParamsKeys) {
                skippedQueryParamsKeys.forEach(key => {
                    delete validatedParams[key];
                }); 
            }
            const res = await GetService({ route, params: validatedParams });

            if (!loadMoreMode) {
                setData(res.data?.result || []);
                if (res?.data?.count) {
                    const pageNoCalculate = Math.ceil(res?.data?.count / pagination.limit);
                    setCount(res.data.count);
                    setPagination((prev) => ({ ...prev, pageNo: pageNoCalculate, page: 2 }));
                }
            }

            const updateData = ({ newData }) => {
                setData(newData.result);
            };

            if (onSuccess) onSuccess(res, updateData);

            return res;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load data";
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // ==== Load More (Pagination) ====
    const loadMoreData = async () => {
        if (pagination.page > pagination.pageNo || loadingMoreData || loading) return;

        setLoadingMoreData(true);
        isFetchingRef.current = true;

        try {
            const nextPage = pagination.page;
            const filterParams = {
                ...params,
                page: nextPage,
                limit: pagination.limit
            };

            const apiParams = paramsValidate(filterParams);
            const res = await GetService({ route, params: apiParams });

            const newResults = res?.data?.result || [];
            setData((prev) => [...prev, ...newResults]);

            if (newResults.length > 0) {
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
            }
        } catch (error) {
            const status = error?.response?.status;
        } finally {
            setLoadingMoreData(false);
            isFetchingRef.current = false;
        }
    };

    // ==== Scroll Listener ====
    const onScrollLoadMore = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;

        const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;
        if (nearBottom && !loadingMoreData && !loading && !isFetchingRef.current) {
            loadMoreData();
        }
    };

    // ==== Effects ====
    useApiEffect(() => {
        if (!notLoadData && !loadMoreMode) {
            getApi({ params, disableUrlParam });
        }
    }, [urlParams.toString()]);

    useApiEffect(() => {
        if (loadMoreMode) {
            getApi({ params, loadMoreMode: true });
        }
    }, []);

    // ==== Return API ====
    return {
        loading,
        data,
        count,
        setCount,
        error,
        setData,
        getData: getApi,
        loadMoreData,
        loadingMoreData,
        setLoadingMoreData,
        onScrollLoadMore,
        setPagination
    };
};

export default useGetData;
