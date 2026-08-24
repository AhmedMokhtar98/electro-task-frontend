import { useLayoutEffect, useRef } from 'react';
const useApiEffect = (callback, dependencies) => {
    // const ref = useRef(true);
    useLayoutEffect(() => {
        // if (ref.current) { ref.current = false; return }
        return callback()
    }, dependencies);
};
export default useApiEffect
// Copy Rights Ahmed Mokhtar //