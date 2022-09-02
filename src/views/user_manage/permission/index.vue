<template>
    <div>
        <page-header :title="page_title"></page-header>
        <div class="" style="width: 95%; margin: 20px auto 0 auto">
            <!-- 多选栏 操作栏-->
            <div class="flex bc-b-gray justify-between pdb10">
                <div>
                    <input
                        class="mgb8 mgr20"
                        type="checkbox"
                        style="zoom: 150%"
                    />
                    <!-- 添加按钮 -->
                    <el-button
                        circle
                        type="primary"
                        size="small"
                        icon="el-icon-plus"
                        @click="insert.open()"
                    ></el-button>
                </div>

                <!-- 分页 -->
                <!-- <div>
                    <div class="mgb8">
                        <el-pagination
                            @current-change="page"
                            layout="prev, pager, next"
                            :total="total"
                            :page-size="pagesize"
                            :current-page="pageno"
                        ></el-pagination>
                    </div>
                </div> -->
            </div>

            <!-- 表格主体 -->
            <div>
                <my-el-table :el_table="table">
                    <template slot-scope="scope">
                        <div v-if="scope.col.prop !== undefined">
                            {{ scope.row[scope.col.prop] }}
                        </div>
                        <div v-else>
                            <div class="flex">
                                <!-- 修改权限按钮 -->
                                <el-button
                                    icon="el-icon-edit"
                                    size="medium"
                                    circle
                                    @click="update.open(scope.row)"
                                ></el-button>
                                <!-- 删除权限按钮 -->
                                <el-button
                                    icon="el-icon-delete"
                                    size="medium"
                                    circle
                                    @click="remove.open(scope.row)"
                                ></el-button>
                                <!-- 权限设置 -->
                                <el-button
                                    icon="el-icon-setting"
                                    size="medium"
                                    circle
                                    @click="setting.open(scope.row)"
                                ></el-button>
                            </div>
                        </div>
                    </template>
                </my-el-table>
            </div>

            <!-- 添加 对话框 -->
            <my-el-dialog :dialog="insert">
                <div class="mgb10">
                    <span>
                        <el-input
                            v-model="insert.data.name"
                            placeholder="请输入新的权限名称"
                            @keyup.enter.native="insert.commit()"
                        ></el-input>
                    </span>
                </div>
                <div class="mgb10">
                    <span>
                        <el-input
                            v-model="insert.data.detail"
                            placeholder="请输入新的权限描述"
                            @keyup.enter.native="insert.commit()"
                        ></el-input>
                    </span>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="insert.close()">取 消</el-button>
                    <el-button
                        type="primary"
                        :disabled="!insert.enable_commit()"
                        @click="insert.do_commit()"
                    >
                        提 交
                    </el-button>
                </span>
            </my-el-dialog>
            <!-- <el-dialog
                :title="insert.title"
                :visible.sync="insert.visible"
                width="30%"
                :close-on-click-modal="false"
            >
                <div class="mgb10">
                    <span>
                        <el-input
                            v-model="insert.data.name"
                            placeholder="请输入新的权限名称"
                            @keyup.enter.native="insert.commit()"
                        ></el-input>
                    </span>
                </div>
                <div class="mgb10">
                    <span>
                        <el-input
                            v-model="insert.data.detail"
                            placeholder="请输入新的权限描述"
                            @keyup.enter.native="insert.commit()"
                        ></el-input>
                    </span>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="insert.close()">取 消</el-button>
                    <el-button
                        type="primary"
                        :disabled="!insert.enable_commit()"
                        @click="insert.commit()"
                    >
                        提 交
                    </el-button>
                </span>
            </el-dialog> -->

            <!-- 修改 对话框 -->
            <el-dialog
                :title="update.title"
                :visible.sync="update.visible"
                width="30%"
                :close-on-click-modal="false"
            >
                <div class="mgb10">
                    <el-input
                        v-model="update.data.name"
                        placeholder="请输入新的权限名称"
                    ></el-input>
                </div>

                <div class="mgb10">
                    <el-input
                        v-model="update.data.detail"
                        placeholder="请输入新的权限描述"
                    ></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="update.close()">取 消</el-button>
                    <el-button
                        type="primary"
                        :disabled="!update.enable_commit()"
                        @click="update.commit(data)"
                    >
                        提 交
                    </el-button>
                </span>
            </el-dialog>

            <!-- 删除 对话框 -->
            <el-dialog
                :title="remove.title"
                :visible.sync="remove.visible"
                width="30%"
                :close-on-click-modal="false"
            >
                <span>您确认要删除权限 '{{ remove.data.name }}' 吗？</span>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="remove.close()">取 消</el-button>
                    <el-button type="danger" @click="remove.commit()">
                        确认删除
                    </el-button>
                </span>
            </el-dialog>

            <!-- 从角色删除菜单对话框 -->
            <my-el-dialog :dialog="setting.remove_api_dialog">
                <span>
                    您确认要删除API
                    {{ setting.remove_api_dialog.data.remove_api.url }}
                    吗？
                </span>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="setting.remove_api_dialog.close()">
                        取 消
                    </el-button>
                    <el-button
                        type="danger"
                        @click="setting.remove_api_dialog.commit()"
                    >
                        确认删除
                    </el-button>
                </span>
            </my-el-dialog>

            <!-- TODO -->

            <my-el-dialog :dialog="setting">
                <div class="mgb20 flex">
                    <div class="flexg2">
                        <el-select
                            v-model="setting.data.insert_api.http_method"
                        >
                            <el-option
                                v-for="method in [
                                    'GET',
                                    'POST',
                                    'DELETE',
                                    'PUT',
                                ]"
                                :key="method"
                                :value="method"
                                :label="method"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="flexg7">
                        <div>
                            <my-auto-completion-input
                                :el_autocompletion="
                                    setting.auto_completion_input
                                "
                                select_prop="url"
                            >
                                <template v-slot="scope">
                                    <div class="flex">
                                        <div>{{ scope.row.http_method }}</div>
                                        <div>{{ scope.row.url }}</div>
                                    </div>
                                </template>
                            </my-auto-completion-input>
                        </div>
                    </div>
                </div>

                <!-- 已添加API资源列表 -->
                <my-el-table :el_table="setting.table">
                    <template slot-scope="scope">
                        <div v-if="scope.col.prop !== undefined">
                            {{ scope.row[scope.col.prop] }}
                        </div>

                        <div v-else>
                            <el-button
                                icon="el-icon-delete"
                                size="medium"
                                circle
                                @click="
                                    setting.remove_api_dialog.open(scope.row)
                                "
                            ></el-button>
                        </div>
                    </template>
                </my-el-table>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="setting.close()">取 消</el-button>
                    <el-button
                        type="primary"
                        :disabled="setting.enable_commit()"
                        @click="setting.do_commit()"
                    >
                        添 加
                    </el-button>
                </span>
            </my-el-dialog>
        </div>
    </div>
</template>

<script>
import MyAutoCompletionInput from '@/views/oop_components/MyAutoCompletionInput.vue';
import { get_token, get_idem } from '@/utils/auth';

import pageHeader from '@/views/common/page-header.vue';
import { Message } from 'element-ui';
import { when_unknow_err } from '@/utils';
import {
    get_api_list_by_path,
    remove_api_from_permission,
} from '@/api/api_resource';
import { ElDialog, ElTable, MyElCompletion } from '@/lib/index';
import {
    create_permission,
    get_api_list_by_permission_id,
    get_permissions,
    insert_api_to_permission_by_api_url_and_method,
    remove_permission_by_id,
    update_permission_by_id,
} from '@/api/permission';
import { cloneDeep } from '@/utils/route';
import MyElTable from '../../oop_components/MyElTable.vue';
import MyElDialog from '../../oop_components/MyElDialog.vue';
var vue;
export default {
    components: {
        pageHeader,
        MyAutoCompletionInput,
        MyElTable,
        MyElDialog,
    },
    data() {
        return {
            query_string: '',
            test_value: '',
            test_input: new MyElCompletion('默认内容', {
                fetch_suggestions(query_string, cb) {
                    console.log('query_string:' + query_string);
                    cb([{ value: 'hello' }, { value: 'world' }]);
                },

                handle_select(row) {
                    console.log(vue.test_input.value);
                },
            }),
            page_title: '权限管理',
            table: new ElTable('权限表格', {
                cols: [
                    {
                        prop: 'name',
                        label: '权限名称',
                    },
                    {
                        prop: 'detail',
                        label: '权限说明',
                    },
                    {
                        prop: undefined,
                        label: '操作',
                    },
                ],

                do_fetch_data(data) {
                    var req_data = { name: vue.query_string };
                    get_permissions(req_data, get_token()).then((resp) => {
                        var page_data = resp.data.permissionList;
                        this.data = [];
                        for (var data of page_data) {
                            this.data.push({
                                name: data.name,
                                detail: data.detail,
                                id: data.id,
                            });
                        }
                    });
                },
            }),

            page_data: [],

            pagesize: 10,
            pageno: 1,
            total: 0,

            idem_token: '',

            insert: new ElDialog('添加权限', {
                reset_data() {
                    this.data = {};
                },
                enable_commit() {
                    if (this.data.name !== '' && this.data.name !== undefined) {
                        return true;
                    } else {
                        return false;
                    }
                },
                before_open(data) {
                    get_idem().then((idem) => {
                        vue.idem_token = idem;
                        this.do_open();
                    });
                },
                do_commit() {
                    var data = {
                        name: this.data.name,
                        detail: this.data.detail,
                    };
                    create_permission(data, get_token(), vue.idem_token)
                        .then((resp) => {
                            Message.success('添加成功');
                            vue.table.fetch_data();
                            this.close();
                        })
                        .catch((resp) => {
                            if (resp.code === 'PERMISSION_EXISTS') {
                                Message.warning('存在同名的权限,请勿重复添加');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            }
                        });
                },
            }),

            remove: new ElDialog('删除权限', {
                enable_commit() {
                    if (this.data.name !== '' && this.data.name !== undefined) {
                        return true;
                    } else {
                        return false;
                    }
                },
                open(data) {
                    data = cloneDeep(data);
                    get_idem().then((idem) => {
                        this.data = data;
                        this.visible = true;
                        vue.idem_token = idem;
                    });
                    this.do_open(data);
                },
                do_commit() {
                    remove_permission_by_id(
                        this.data.id,
                        get_token(),
                        vue.idem_token,
                    )
                        .then((resp) => {
                            Message.success('删除成功');
                            vue.table.fetch_data();
                            this.close();
                        })
                        .catch((resp) => {
                            if (resp.code === 'NO_PERMISSION') {
                                Message.error('权限不存在');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else {
                                when_unknow_err(resp.code);
                            }
                        });
                },
            }),

            update: new ElDialog('修改权限', {
                // data: { id: '', name: '', detail: '' },
                enable_commit() {
                    if (this.data.name !== '' && this.data.name !== undefined) {
                        return true;
                    } else {
                        return false;
                    }
                },
                before_open(data) {
                    data = cloneDeep(data);
                    get_idem().then((idem) => {
                        this.data = data;
                        this.visible = true;
                        vue.idem_token = idem;
                    });
                    this.do_open(data);
                },
                do_commit() {
                    var data = {
                        name: this.data.name,
                        detail: this.data.detail,
                    };
                    update_permission_by_id(
                        this.data.id,
                        data,
                        get_token(),
                        vue.idem_token,
                    )
                        .then((resp) => {
                            Message.success('更新成功');
                            vue.table.fetch_data();
                            this.close();
                        })
                        .catch((resp) => {
                            if (resp.code === 'NO_PERMISSION') {
                                Message.error('权限不存在');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else if (resp.code === 'PERMISSION_EXISTS') {
                                Message.warning('权限名称重复');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else {
                                when_unknow_err(resp.code);
                            }
                        });
                },
            }),
            // TODO
            setting: new ElDialog('为权限添加API资源', {
                auto_completion_input: new MyElCompletion('默认内容', {
                    fetch_suggestions(query_string, cb) {
                        var params = {
                            url: vue.setting.auto_completion_input.value,
                            method: vue.setting.data.insert_api.http_method,
                        };
                        get_api_list_by_path(params, get_token()).then(
                            (resp) => {
                                var resp_data = resp.data.apiResourceList;
                                var suggestions = [];
                                for (var item of resp_data) {
                                    suggestions.push({
                                        id: item.id,
                                        url: item.url,
                                        http_method: item.httpMethod,
                                    });
                                }
                                cb(suggestions);
                            },
                        );
                    },

                    value: '',

                    reset_data() {
                        this.value = '';
                    },

                    do_select(row) {
                        var insert_api_url = row.url;
                        vue.setting.data.insert_api.url = insert_api_url;
                    },
                }),
                table: new ElTable('菜单列表', {
                    cols: [
                        {
                            prop: 'http_method',
                            label: '请求方法',
                        },
                        {
                            prop: 'url',
                            label: '请求路径',
                        },

                        {
                            prop: 'unique_tag',
                            label: '唯一标识',
                        },

                        {
                            prop: undefined,
                            label: '操作',
                        },
                    ],
                    do_fetch_data(data) {
                        get_api_list_by_permission_id(
                            data.id,
                            get_token(),
                        ).then((resp) => {
                            var api_list = resp.data.apiResourceList;
                            api_list = api_list.map((elem) => {
                                return {
                                    id: elem.id,
                                    url: elem.url,
                                    http_method: elem.httpMethod,
                                    unique_tag: elem.uniqueTag,
                                };
                            });
                            this.data = api_list;
                        });
                    },
                }),

                remove_api_dialog: new ElDialog('删除权限的API资源', {
                    reset_data() {
                        this.data = {
                            remove_permission: {},
                            remove_api: {},
                        };
                    },
                    do_commit(data) {
                        remove_api_from_permission(
                            this.data.remove_permission.id,
                            this.data.remove_api.id,
                            get_token(),
                            vue.idem_token,
                        ).then((resp) => {
                            Message.success('删除成功');
                            var data = vue.setting.data.permission;
                            vue.setting.table.fetch_data(data);
                            this.close();
                        });
                    },
                    before_open(data) {
                        this.data.remove_api = data;
                        this.data.remove_permission =
                            vue.setting.data.permission;
                        get_idem().then((idem) => {
                            vue.idem_token = idem;
                            this.do_open();
                        });
                    },
                }),
                do_commit(data) {
                    if (
                        this.auto_completion_input.value === '' ||
                        this.auto_completion_input.value === undefined
                    ) {
                        Message.warning('请选择要添加的api');
                        return;
                    }
                    let req_data = {
                        url: this.auto_completion_input.value,
                        method: this.data.insert_api.http_method,
                    };
                    insert_api_to_permission_by_api_url_and_method(
                        this.data.permission.id,
                        req_data,
                        get_token(),
                        vue.idem_token,
                    )
                        .then((resp) => {
                            // var insert_api = resp.data.insertApi;
                            Message.success('添加成功');
                            var data = this.data.permission;
                            this.table.fetch_data(data);
                            this.auto_completion_input.value = '';
                            // this.data.api_list.push({
                            //     id: insert_api.id,
                            //     url: insert_api.url,
                            //     http_method: insert_api.httpMethod,
                            // });
                            get_idem().then((idem) => {
                                vue.idem_token = idem;
                            });
                            // 不知道为啥vue不会主动更新视图，需要手动更新
                            vue.$forceUpdate();
                        })
                        .catch((resp) => {
                            if (resp.code === 'NO_PERMISSION') {
                                Message.error('权限不存在');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else if (resp.code === 'NO_API') {
                                Message.warning('API 不存在');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else if (resp.code === 'API_EXISTS') {
                                Message.warning('API资源在权限中已存在');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else {
                                when_unknow_err(resp.code);
                            }
                        });
                },

                reset_data() {
                    this.data = {
                        insert_api: {
                            http_method: 'GET',
                            url: '',
                        },
                    };
                },

                before_close() {
                    this.reset_data();
                    this.auto_completion_input.reset_data();
                },
                // 必须重写
                enable_commit() {
                    if (this.data.name !== '' && this.data.name !== undefined) {
                        return true;
                    } else {
                        return false;
                    }
                },

                //    重写
                before_open(data) {
                    this.data.permission = data;
                    this.table.fetch_data(data);
                    get_idem().then((idem) => {
                        vue.idem_token = idem;
                        this.do_open();
                    });
                },

                // 这个函数由vue执行，拿不到this
                handle_select(data) {
                    vue.setting.data.insert_api.url = data.url;
                    vue.setting.data.insert_api = data;
                },

                query_suggestion(_, cb) {
                    var params = {
                        url: vue.setting.data.insert_api.url,
                        method: vue.setting.data.insert_api.http_method,
                    };
                    get_api_list_by_path(params, get_token()).then((resp) => {
                        var resp_data = resp.data.apiResourceList;
                        var suggestions = [];
                        for (var item of resp_data) {
                            suggestions.push({
                                id: item.id,
                                url: item.url,
                                http_method: item.httpMethod,
                            });
                        }
                        cb(suggestions);
                    });
                },
            }),
        };
    },

    created() {
        vue = this;
        this.table.fetch_data();
    },
    methods: {
        click_refresh() {
            refresh_api_resource(get_token()).then((resp) => {
                this.table.fetch_data();
                Message.success('刷新成功');
            });
        },
    },
};
</script>

<style lang="scss">
@import '~@/styles/common-style.scss';
</style>
