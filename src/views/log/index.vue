<template>
    <div>
        <page-header :title="page_title"></page-header>
        <div class="" style="width: 95%; margin: 20px auto 0 auto">
            <!-- 搜索栏目 -->
            <div class="bc-b-gray mgb8">
                <div class="flex" style="width: 50%">
                    <el-button
                        id="search"
                        class="el-icon-search fs20 mgr20 mgb8 br15"
                        style=""
                        size="small"
                        @click="search"
                    ></el-button>
                    <el-autocomplete
                        v-model="query.sam_account_name"
                        class="mgr20 mgb8 inline-input"
                        :fetch-suggestions="query_search"
                        placeholder="sAMAccountName"
                        :trigger-on-focus="false"
                        style="width: 33%"
                        @select="handle_select"
                    >
                        <template slot-scope="{ item }">
                            <div
                                class=""
                                style="
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                "
                            >
                                {{ item.cn }}
                            </div>
                            <span class="fs12" style="color: #b4b4b4">
                                {{ item.value }}
                            </span>
                        </template>
                    </el-autocomplete>

                    <el-date-picker
                        v-model="query.start_time"
                        style="width: 33%"
                        class="mgr20 mgb8"
                        type="datetime"
                        placeholder="过滤起始时间"
                    ></el-date-picker>

                    <el-date-picker
                        v-model="query.end_time"
                        style="width: 33%"
                        class="mgr20 mgb8"
                        type="datetime"
                        placeholder="过滤终止时间"
                    ></el-date-picker>
                </div>
            </div>
            <!-- 多选栏 -->
            <div class="flex justify-between bc-b-gray">
                <input class="mgb8" type="checkbox" style="zoom: 150%" />
                <div class="mgb8">
                    <el-pagination
                        layout="prev, pager, next"
                        :total="total"
                        :page-size="pagesize"
                        :current-page="pageno"
                        @current-change="page"
                    ></el-pagination>
                </div>
            </div>

            <!-- 表格主体 -->
            <div>
                <el-table :data="log_data" style="width: 100%">
                    <el-table-column prop="time" label="日期" width="180"></el-table-column>
                    <el-table-column
                        prop="sam_account_name"
                        label="用户账号"
                        width="180"
                    ></el-table-column>
                    <el-table-column prop="detail" label="详情"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { get_token } from '@/utils/auth';
import { get_log_page } from '@/api/log';
import { get_full_sam_account_name } from '@/api/user';
import pageHeader from '@/views/common/page-header.vue';
import { when_unknow_err } from '@/utils';
export default {
    components: {
        pageHeader,
    },
    data() {
        return {
            page_title: '日志管理',
            total: 0,
            log_data: [],
            pagesize: 10,
            pageno: 1,
            query: {
                sam_account_name: '',
                start_time: '',
                end_time: '',
            },
        };
    },
    created() {
        this.fetch_log_data();
    },
    methods: {
        handle_select() {
            this.page();
        },
        query_search(query_string, cb) {
            get_full_sam_account_name(query_string, get_token())
                .then((resp) => {
                    cb(resp.data.fullSamAccountNameList);
                })
                .catch((resp) => when_unknow_err(resp.code));
        },
        search() {
            this.page();
        },
        page(pageno) {
            this.pageno = pageno;
            this.fetch_log_data();
        },
        fetch_log_data() {
            if (this.query.sam_account_name == '') {
                this.query.sam_account_name = undefined;
            }
            if (this.query.start_time == '') {
                this.query.start_time = undefined;
            }
            if (this.query.end_time == '') {
                this.query.end_time = undefined;
            }
            // 查询条件
            var data = {
                pageSize: this.pagesize,
                pageNo: this.pageno,
                samAccountName: this.query.sam_account_name,
                startTime: this.query.start_time,
                endTime: this.query.end_time,
            };
            get_log_page(data, get_token()).then((resp) => {
                var log_data = resp.data.logList;
                this.log_data = [];
                for (var log of log_data) {
                    this.log_data.push({
                        sam_account_name: log.samAccountName,
                        time: log.time,
                        detail: log.detail,
                    });
                }
                this.total = resp.data.total;
            });
        },
    },
};
</script>
<style lang="scss">
@import '~@/styles/common-style.scss';
</style>
<style>
#search:hover {
    background-color: #f5f5f5;
}

#search:active {
    background-color: #eeeeee;
}
</style>
