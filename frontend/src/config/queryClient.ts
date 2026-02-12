import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, //5menit
            gcTime: 1000 * 60 * 10,//10mnit
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false
        },
    },
});
export default queryClient