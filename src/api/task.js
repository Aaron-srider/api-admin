import request from '@/utils/request';

const baseURL = 'http://192.168.31.94:8088';
export function create_task(params) {
    return request({
        baseURL: baseURL,
        url: `/task`,
        method: 'post',
        params: params,
    });
}

export function get_tasks() {
    return request({
        baseURL: baseURL,
        url: `/tasks`,
        method: 'get',
    });
}

export function remove_task(taskId) {
    return request({
        baseURL: baseURL,
        url: `/task/${taskId}`,
        method: 'delete',
    });
}

export function get_log_list(taskId) {
    return request({
        baseURL: baseURL,
        url: `/logs`,
        params: {
            taskId,
        },
        method: 'get',
    });
}
