import { onMounted, reactive, ref } from 'vue'


export default function useAxios(configObj) {
    const response = reactive({
        res: [],
        error: {},
        loading: true,
        controller: {},
    })

    const reload = ref(0)
    const refetch = () => reload.value++

    const { axiosInstance, method, url, requestConfig = {} } = configObj
    
    onMounted(() => {
        const ctrl = new AbortController()

        const axiosFetch = async () => {
            try {
                response.loading = true
    
                response.controller = ctrl
    
                const res = await axiosInstance[method.toLowerCase()](url, requestConfig.rawData)
                // console.log("response: ", res)
                response.res = res.data
            } catch (err) {
                // console.log(err.response.data)
                response.error = JSON.parse(err.response.data)
            } finally {
                response.loading = false
            }
        }

        axiosFetch()

        // 清除此reqeust減少暫存
        return () => response.controller && response.controller.abort()
    })

    return [response, refetch]
}