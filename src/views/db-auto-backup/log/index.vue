<template>
    <div>
        <!-- #region log list -->
        <el-table-view :model="table">
            <template slot-scope="scope">
                <div v-if="scope.col.prop === 'duration'">
                    <readable-display
                        type="duration"
                        :value="scope.row.duration"
                    ></readable-display>
                </div>

                <div v-else>
                    {{ scope.row[scope.col.prop] }}
                </div>
            </template>
        </el-table-view>
        <!-- #endregion -->
    </div>
</template>
<script>
import ElDialogView from '@/views/oop_components/ElDialogView.vue';
import readableDisplay from '@/views/common/readable-display.vue';
import pageHeader from '@/views/common/page-header.vue';
import toolBar from '@/views/common/tool-bar.vue';
import pageContent from '@/views/common/page-content.vue';
import ElTableView from '@/views/oop_components/ElTableView.vue';
import { OopElTableModel, OopElDialogModel } from '@/lib/index';
import { parse_query, StringUtils, when_unknow_err } from '@/utils';
import { Message } from 'element-ui';
import { get_log_list, get_tasks } from '@/api/task';
var vue;
export default {
    components: {
        readableDisplay,
        ElTableView,
        pageContent,
        toolBar,
        pageHeader,
        ElDialogView,
    },
    data() {
        return {
            query: parse_query(this.$route.query),
            table: new OopElTableModel('自动备份任务列表', {
                cols: [
                    {
                        prop: 'id',
                        label: '日志id',
                    },
                    {
                        prop: 'msg',
                        label: '日志信息',
                    },
                    {
                        prop: 'status',
                        label: '状态',
                    },
                    {
                        prop: 'duration',
                        label: '执行时间',
                    },
                ],
                do_fetch_data() {
                    // this.data = [
                    //     {
                    //         id: 1,
                    //         name: '测试任务',
                    //         start_time: '2022-22-22 22:22:22',
                    //         status: '进行中',
                    //         exe_times: 3,
                    //     },
                    // ];
                    get_log_list(vue.query.task_id).then((resp) => {
                        this.data = resp.data;
                        this.fetch_over();
                    });
                },
            }),
        };
    },
    created() {
        vue = this;
        this.table.fetch_data();
    },
    computed: {},
    methods: {},
};
</script>
<style lang="scss" scoped></style>
