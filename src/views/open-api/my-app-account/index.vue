<template>
    <div>
        <page-header :title="page_title"></page-header>

        <div class="" style="width: 95%; margin: 20px auto 0 auto">
            <!-- 多选栏 操作栏-->
            <div class="flex bc-b-gray justify-between align-center">
                <div>
                    <el-button
                        class="mgb8 mgl10"
                        type="primary"
                        @click="apply_appid_dialog.open()"
                    >
                        申请AppID
                    </el-button>
                </div>

                <!-- 分页 -->
                <div>
                    <div class="mgb8">
                        <my-el-pagination
                            :pagination="pagination"
                        ></my-el-pagination>
                    </div>
                </div>
            </div>

            <!-- 表格主体 -->
            <my-el-table :el_table="table">
                <template slot-scope="scope">
                    <div v-if="scope.col.prop != undefined">
                        {{ scope.row[scope.col.prop] }}
                    </div>
                    <div v-else>
                        <div class="flex">
                            <el-button
                                icon="el-icon-edit"
                                size="medium"
                                circle
                                @click="update_app_dialog.open(scope.row)"
                            ></el-button>
                            <el-button
                                icon="el-icon-delete"
                                size="medium"
                                circle
                                @click="remove_my_app_dialog.open(scope.row)"
                            ></el-button>
                        </div>
                    </div>
                </template>
            </my-el-table>

            <!-- 添加 对话框 -->
            <my-el-dialog :dialog="apply_appid_dialog">
                <div class="mgb10">
                    <span>请输入App名称</span>
                </div>
                <div class="mgb10">
                    <span>
                        <el-input
                            v-model="apply_appid_dialog.data.appname"
                            placeholder="请输入新的App名称"
                            @keyup.enter.native="apply_appid_dialog.commit()"
                        ></el-input>
                    </span>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="apply_appid_dialog.close()">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="apply_appid_dialog.commit()"
                    >
                        提 交
                    </el-button>
                </span>
            </my-el-dialog>

            <!-- 添加成功 -->
            <my-el-dialog :dialog="apply_appid_dialog.success_dialog">
                <div class="mgb10">
                    <span>App名称</span>
                </div>
                <div class="mgb10">
                    <el-input
                        :value="apply_appid_dialog.success_dialog.data.appname"
                        disabled
                    ></el-input>
                </div>
                <div class="mgb10">
                    <span>AppId</span>
                </div>
                <div class="mgb10">
                    <el-input
                        :value="apply_appid_dialog.success_dialog.data.appid"
                        disabled
                    ></el-input>
                </div>
                <div class="mgb10">
                    <span>AppSecret</span>
                </div>
                <div class="mgb10">
                    <el-input
                        :value="
                            apply_appid_dialog.success_dialog.data.appsecret
                        "
                        disabled
                    ></el-input>
                </div>

                <div class="mgb10 mgt20">
                    <span>请复制并保存好AppSecret</span>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button
                        @click="apply_appid_dialog.success_dialog.commit()"
                    >
                        确 定
                    </el-button>
                </span>
            </my-el-dialog>

            <!-- 修改 对话框 -->
            <my-el-dialog :dialog="update_app_dialog">
                <div class="mgb10">
                    <span>请输入App名称</span>
                </div>
                <div class="mgb10">
                    <span>
                        <el-input
                            v-model="update_app_dialog.data.appname"
                            placeholder="请输入新的App名称"
                            @keyup.enter.native="update_app_dialog.commit()"
                        ></el-input>
                    </span>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="update_app_dialog.close()">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="update_app_dialog.commit()"
                    >
                        提 交
                    </el-button>
                </span>
            </my-el-dialog>

            <!-- 删除 对话框 -->
            <my-el-dialog :dialog="remove_my_app_dialog">
                <span>
                    您确认要删除APP
                    {{ remove_my_app_dialog.data.appname }}
                    吗？
                </span>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="remove_my_app_dialog.close()">
                        取 消
                    </el-button>
                    <el-button
                        type="danger"
                        @click="remove_my_app_dialog.commit()"
                    >
                        确认删除
                    </el-button>
                </span>
            </my-el-dialog>

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
import pageHeader from '@/views/common/page-header.vue';
import { Message } from 'element-ui';
import { when_unknow_err } from '@/utils';
import {
    get_api_list,
    refresh_api_resource,
    remove_api_resource_by_id,
    update_api_resource_by_id,
} from '@/api/api_resource';
import MyElPagination from '@/views/oop_components/MyElPagination.vue';
import MyElDialog from '@/views/oop_components/MyElDialog.vue';
import MyElTable from '@/views/oop_components/MyElTable.vue';
import { ElDialog, ElTable, Page } from '@/lib/index';
import {
    apply_appid,
    get_my_apps,
    remove_my_app,
    update_my_app,
} from '@/api/app_access';

var vue;
export default {
    components: {
        pageHeader,
        MyElDialog,
        MyElPagination,
        MyElTable,
    },
    data() {
        return {
            table: new ElTable('app表格', {
                cols: [
                    {
                        prop: 'appname',
                        label: '应用名称',
                    },
                    {
                        prop: 'appid',
                        label: 'AppID',
                    },
                    {
                        prop: undefined,
                        label: '操作',
                    },
                ],

                do_fetch_data(data) {
                    vue.pagination.do_page();
                },
            }),
            apply_appid_dialog: new ElDialog('申请AppID', {
                success_dialog: new ElDialog('申请成功', {
                    reset_data() {
                        this.data = {
                            appname: '',
                            appid: '',
                            appsecret: '',
                        };
                    },
                    enable_commit() {
                        return true;
                    },
                    do_commit(data) {
                        this.close();
                    },
                    before_open(data) {
                        this.data.appname = data.appname;
                        this.data.appid = data.appid;
                        this.data.appsecret = data.appsecret;
                        get_idem().then((idem) => {
                            vue.idem_token = idem;
                            this.do_open();
                        });
                    },
                }),
                reset_data() {
                    this.data = {
                        appname: '',
                    };
                },
                enable_commit() {
                    return (
                        this.data.appname != undefined &&
                        this.data.appname !== ''
                    );
                },
                do_commit(data) {
                    let params = {
                        appName: this.data.appname,
                    };
                    apply_appid(params, get_token(), vue.idem_token).then(
                        (resp) => {
                            this.success_dialog.open({
                                appname: this.data.appname,
                                appid: resp.data.appid,
                                appsecret: resp.data.appsecret,
                            });
                            vue.table.fetch_data();
                            this.close();
                        },
                    );
                },
                before_open(data) {
                    get_idem().then((idem) => {
                        vue.idem_token = idem;
                        this.do_open();
                    });
                },
            }),

            update_app_dialog: new ElDialog('修改App信息', {
                reset_data() {
                    this.data = {
                        appname: '',
                        id: undefined,
                    };
                },
                enable_commit() {
                    return (
                        this.data.appname != undefined &&
                        this.data.appname !== '' &&
                        this.data.id != undefined
                    );
                },
                do_commit(data) {
                    let id = this.data.id;
                    let params = {
                        appName: this.data.appname,
                    };
                    update_my_app(id, params, get_token(), vue.idem_token)
                        .then((resp) => {
                            Message.success('更新成功');
                            vue.table.fetch_data();
                            this.close();
                        })
                        .catch((resp) => {
                            if (resp.code === 'NOT_APP_OWNER') {
                                Message.warning('不是App所有者,无法修改');
                            } else if (resp.code === 'NO_APP') {
                                Message.warning('App不存在');
                            } else {
                                when_unknow_err(resp.code);
                            }
                            this.close();
                        });
                },
                before_open(data) {
                    let appname = data.appname;
                    let id = data.id;

                    this.data.appname = appname;
                    this.data.id = id;
                    get_idem().then((idem) => {
                        vue.idem_token = idem;
                        this.do_open();
                    });
                },
            }),
            remove_my_app_dialog: new ElDialog('删除APP', {
                reset_data() {
                    this.data = {
                        appname: '',
                        id: undefined,
                    };
                },
                enable_commit() {
                    return this.data.id != undefined;
                },
                do_commit(data) {
                    let id = this.data.id;

                    remove_my_app(id, get_token(), vue.idem_token)
                        .then((resp) => {
                            Message.success('删除成功');
                            vue.table.fetch_data();
                            this.close();
                        })
                        .catch((resp) => {
                            if (resp.code === 'NOT_APP_OWNER') {
                                Message.warning('不是App所有者,无法修改');
                            } else if (resp.code === 'NO_APP') {
                                Message.warning('App不存在');
                            } else {
                                when_unknow_err(resp.code);
                            }
                            this.close();
                        });
                },
                before_open(data) {
                    let appname = data.appname;
                    let id = data.id;

                    this.data.appname = appname;
                    this.data.id = id;
                    get_idem().then((idem) => {
                        vue.idem_token = idem;
                        this.do_open();
                    });
                },
            }),
            pagination: new Page(1, 10, {
                do_page() {
                    let page_params = {
                        pageSize: this.pagesize,
                        pageNo: this.pageno,
                    };
                    get_my_apps(page_params, get_token()).then((resp) => {
                        vue.table.data = [];
                        this.total = resp.data.total;
                        let pagedata = resp.data.pageList;
                        for (let i = 0; i < pagedata.length; i++) {
                            const item = pagedata[i];
                            vue.table.data.push({
                                id: item.id,
                                appname: item.appName,
                                appid: item.appId,
                            });
                        }
                    });
                },
            }),

            page_title: '我的第三方应用',
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
        this.table.fetch_data();
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
