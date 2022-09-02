<template>
    <div>
        <page-header :title="page_title"></page-header>
        <div class="" style="width: 95%; margin: 20px auto 0 auto">
            <!-- 多选栏 操作栏-->
            <div class="flex bc-b-gray justify-between">
                <div>
                    <input
                        class="mgb8 mgr20"
                        type="checkbox"
                        style="zoom: 150%"
                    />
                    <!-- 添加按钮 -->

                    <!-- 不同于其他实体，管理员只能刷新API，不能手动添加 -->
                    <!-- <el-button
                        circle
                        type="primary"
                        size="small"
                        icon="el-icon-plus"
                        @click="open_add_dialog"
                    ></el-button> -->

                    <!-- 刷新按钮 -->
                    <el-button
                        class="mgl10"
                        circle
                        size="small"
                        icon="el-icon-refresh"
                        @click="click_refresh"
                    ></el-button>
                </div>

                <!-- 分页 -->
                <div>
                    <div class="mgb8">
                        <my-el-pagination
                            :pagination="pagination"
                        ></my-el-pagination>
                        <!-- <el-pagination
                            layout="prev, pager, next"
                            :total="total"
                            :page-size="pagesize"
                            :current-page="pageno"
                            @current-change="page"
                        ></el-pagination> -->
                    </div>
                </div>
            </div>

            <!-- 表格主体 -->
            <div>
                <el-table :data="page_data" style="width: 100%">
                    <el-table-column
                        prop="http_method"
                        :label="table_col_1"
                    ></el-table-column>
                    <el-table-column
                        prop="url"
                        :label="table_col_2"
                    ></el-table-column>

                    <el-table-column
                        prop="detail"
                        :label="table_col_3"
                    ></el-table-column>

                    <el-table-column>
                        <template slot-scope="scope">
                            <div class="flex">
                                <el-button
                                    icon="el-icon-edit"
                                    size="medium"
                                    circle
                                    @click="open_edit_dialog(scope.row)"
                                ></el-button>
                                <el-button
                                    icon="el-icon-delete"
                                    size="medium"
                                    circle
                                    @click="open_delete_dialog(scope.row)"
                                ></el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 添加 对话框 -->
            <el-dialog
                :title="insert_dialog_title"
                :visible.sync="insert_dialogVisible"
                width="30%"
                :close-on-click-modal="false"
                @close="handleClose"
            >
                <div class="mgb10">
                    <el-pagination
                        layout="prev, pager, next"
                        :total="total"
                        :page-size="pagesize"
                        :current-page="pageno"
                        @current-change="page"
                    ></el-pagination>
                    <el-select v-model="new_http_method">
                        <el-option
                            v-for="http_method in [
                                'GET',
                                'POST',
                                'DELETE',
                                'PUT',
                            ]"
                            :key="http_method"
                            :label="http_method"
                            :value="http_method"
                        >
                            {{ http_method }}
                        </el-option>
                    </el-select>
                </div>
                <div class="mgb10">
                    <span>
                        <el-input
                            v-model="new_api_url"
                            placeholder="请输入新的API路径"
                            @keyup.enter.native="commit_insert"
                        ></el-input>
                    </span>
                </div>
                <div class="mgb10">
                    <span>
                        <el-input
                            v-model="new_api_detail"
                            placeholder="请输入新的API描述"
                            @keyup.enter.native="commit_insert"
                        ></el-input>
                    </span>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="insert_dialogVisible = false">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        :disabled="
                            new_http_method == undefined ||
                            new_http_method == '' ||
                            new_api_url == undefined ||
                            new_api_url == ''
                                ? true
                                : false
                        "
                        @click="commit_insert"
                    >
                        提 交
                    </el-button>
                </span>
            </el-dialog>

            <!-- 修改 对话框 -->
            <el-dialog
                :title="update_dialog_title"
                :visible.sync="update_dialogVisible"
                width="30%"
                :close-on-click-modal="false"
                @close="handleClose"
            >
                <!-- <div class="mgb10">
                    <el-select v-model="update_http_method">
                        <el-option
                            :label="http_method"
                            :key="http_method"
                            :value="http_method"
                            v-for="http_method in [
                                'GET',
                                'POST',
                                'DELETE',
                                'PUT',
                            ]"
                        >
                            {{ http_method }}
                        </el-option>
                    </el-select>
                </div>

                <div class="mgb10">
                    <el-input
                        v-model="update_api_url"
                        placeholder="请输入新的API路径"
                    ></el-input>
                </div> -->

                <div class="mgb10">
                    <el-input
                        v-model="update_api_detail"
                        placeholder="请输入新的API描述"
                    ></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="update_dialogVisible = false">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        :disabled="update_menu_path !== '' ? true : false"
                        @click="commit_update"
                    >
                        提 交
                    </el-button>
                </span>
            </el-dialog>

            <!-- 删除 对话框 -->
            <el-dialog
                :title="remove_dialog_title"
                :visible.sync="remove_dialogVisible"
                width="30%"
                :close-on-click-modal="false"
                @close="handleClose"
            >
                <span>
                    您确认要删除API资源
                    {{ remove.api.http_method + ' ' + remove.api.url }}
                    吗？
                </span>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="remove_dialogVisible = false">
                        取 消
                    </el-button>
                    <el-button type="danger" @click="commit_remove">
                        确认删除
                    </el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { get_token, get_idem } from '@/utils/auth';
import {
    get_role_list,
    insert_role,
    remove_role,
    update_role,
} from '@/api/role';

import {
    insert_menu,
    get_menu_page,
    remove_menu,
    update_menu,
} from '@/api/menu';
import pageHeader from '@/views/common/page-header.vue';
import { Message } from 'element-ui';
import { when_unknow_err } from '@/utils';
import {
    get_api_list,
    insert_new_api,
    refresh_api_resource,
    remove_api_resource_by_id,
    update_api_resource_by_id,
} from '@/api/api_resource';
import MyElPagination from '@/views/oop_components/MyElPagination.vue';
import { Page } from '@/lib/index';

var vue;
export default {
    components: {
        pageHeader,
        MyElPagination,
    },
    data() {
        return {
            pagination: new Page(1, 10, {
                do_page() {
                    vue.fetch_data();
                },
            }),

            page_title: 'API资源管理',
            table_col_1: 'HTTP请求方法',
            table_col_2: 'API路径',
            table_col_3: 'API说明',

            page_data: [],

            pagesize: 10,
            pageno: 1,
            total: 0,

            idem_token: '',

            insert_dialog_title: '新增API',
            insert_dialogVisible: false,
            new_menu_path: '',
            new_menu_detail: '',

            new_http_method: 'GET',
            new_api_url: '',
            new_api_detail: '',

            remove_dialog_title: '删除API',
            remove_dialogVisible: false,
            remove_role_name: '',
            remove_menu: undefined,
            remove: {
                api: {},
            },

            update_dialog_title: '更新API',
            update_dialogVisible: false,
            update_roleid: '',
            update_menu: {},
            update_menu_id: '',
            update_menu_path: '',
            update_menu_detail: '',

            // update_http_method: "GET",
            // update_api_url: "",
            update_api_detail: '',
            update_api: {},
        };
    },

    created() {
        vue = this;
        this.fetch_data();
    },
    methods: {
        page(pageno) {
            this.pageno = pageno;
            this.fetch_data();
        },
        fetch_data() {
            var data = {
                pageSize: this.pagination.pagesize,
                pageNo: this.pagination.pageno,
            };
            get_api_list(data, get_token()).then((resp) => {
                var page_data = resp.data.apiResourceList;
                this.pagination.total = resp.data.total;
                this.page_data = [];
                for (var data of page_data) {
                    this.page_data.push({
                        url: data.url,
                        http_method: data.httpMethod,
                        detail: data.detail,
                        id: data.id,
                    });
                }
            });
        },

        click_refresh() {
            refresh_api_resource(get_token()).then((resp) => {
                this.fetch_data();
                Message.success('刷新成功');
            });
        },

        open_add_dialog() {
            get_idem().then((idem) => {
                this.insert_dialogVisible = true;
                this.idem_token = idem;
            });
        },
        handleClose() {
            this.idem_token = '';
            this.update_roleid = undefined;
            this.new_role_name = '';
            this.new_menu_path = '';
            this.new_menu_detail = '';
            this.update_menu = {};
            this.remove_role_name = '';
            this.remove_menu = undefined;
            this.insert_dialogVisible = false;
            this.remove_dialogVisible = false;
            this.update_dialogVisible = false;

            this.update_menu_id = '';
            this.update_menu_name = '';
            this.update_menu_path = '';

            this.update_http_method = 'GET';
            this.update_api_url = '';
            this.update_api_detail = '';
            this.update_api = {};

            this.new_http_method = 'GET';
            this.new_api_url = '';
            this.new_api_detail = '';
            console.log('close dialog');
        },
        commit_insert() {
            // this.insert_menu();
        },
        // insert_menu() {
        //     if (
        //         this.new_api_url == undefined ||
        //         this.new_api_url == "" ||
        //         this.new_http_method == undefined ||
        //         this.new_http_method == ""
        //     ) {
        //         Message.warning("url和method为必填项");
        //         return;
        //     }
        //     var data = {
        //         detail: this.new_api_detail,
        //         url: this.new_api_url,
        //         httpMethod: this.new_http_method,
        //     };
        //     // TODO
        //     insert_new_api(data, get_token(), this.idem_token)
        //         .then((resp) => {
        //             Message.success("新增API成功");
        //             this.fetch_data();
        //             this.insert_dialogVisible = false;
        //         })
        //         .catch((resp) => {
        //             if (resp.code == 'API_EXISTS') {
        //                 this.$message({
        //                     type: "warning",
        //                     message: "API已存在",
        //                 });
        //                 get_idem().then((idem) => {
        //                     this.idem_token = idem;
        //                 });
        //                 return;
        //             }
        //             when_unknow_err(resp.code);
        //         });
        // },

        open_delete_dialog(row) {
            get_idem().then((idem_token) => {
                console.log(idem_token);
                this.idem_token = idem_token;
                this.remove_dialogVisible = true;
                this.remove.api = row;
            });
        },

        commit_remove() {
            remove_api_resource_by_id(
                this.remove.api.id,
                get_token(),
                this.idem_token,
            )
                .then((resp) => {
                    this.remove_dialogVisible = false;
                    Message.success('删除成功');
                    this.fetch_data();
                })
                .catch((resp) => {
                    when_unknow_err(resp.code, () => {
                        this.remove_dialogVisible = false;
                    });
                });
        },
        open_edit_dialog(row) {
            this.update_api_url = row.url;
            this.update_api_detail = row.detail;
            this.update_http_method = row.http_method;
            this.update_api = row;
            get_idem().then((idem_token) => {
                console.log(idem_token);
                this.idem_token = idem_token;
                this.update_dialogVisible = true;
            });
        },
        commit_update() {
            var data = {
                url: this.update_api_url,
                method: this.update_http_method,
                detail: this.update_api_detail,
            };
            var update_api_id = this.update_api.id;
            update_api_resource_by_id(
                update_api_id,
                data,
                get_token(),
                this.idem_token,
            )
                .then((resp) => {
                    Message.success('修改API信息成功');
                    this.fetch_data();
                    this.update_dialogVisible = false;
                })
                .catch((resp) => {
                    if (resp.code == 'NO_API') {
                        Message.warning('API不存在');
                        // 再申请一次令牌
                        get_idem().then((idem) => {
                            this.idem_token = idem;
                        });
                        return;
                    }
                    when_unknow_err(resp.code, () => {});
                });
        },
    },
};
</script>

<style lang="scss">
@import '~@/styles/common-style.scss';
</style>
