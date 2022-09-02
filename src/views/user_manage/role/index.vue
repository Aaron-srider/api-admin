<template>
    <div>
        <page-header :title="page_title"></page-header>
        <div class="" style="width: 95%; margin: 20px auto 0 auto">
            <!-- 多选栏 操作栏-->
            <div class="flex bc-b-gray">
                <input class="mgb8 mgr20" type="checkbox" style="zoom: 150%" />
                <button
                    class="no-border mgb8 br5 click-css"
                    @click="open_add_role"
                >
                    <i class="el-icon-plus pd8" style=""></i>
                </button>
            </div>

            <!-- 表格主体 -->
            <div>
                <el-table :data="role_data" style="width: 100%">
                    <el-table-column
                        prop="name"
                        :label="table_col_1"
                        min-width="200"
                    ></el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div class="flex">
                                <el-button
                                    v-if="scope.row.name != '超级管理员'"
                                    icon="el-icon-edit"
                                    size="medium"
                                    style="align-items: center"
                                    @click="open_edit_dialog(scope.row)"
                                ></el-button>
                                <el-button
                                    v-if="scope.row.name != '超级管理员'"
                                    icon="el-icon-delete"
                                    size="medium"
                                    @click="open_delete_dialog(scope.row)"
                                ></el-button>
                                <el-button
                                    v-if="scope.row.name != '超级管理员'"
                                    icon="el-icon-menu"
                                    size="medium"
                                    @click="insert_menu_dialog.open(scope.row)"
                                ></el-button>
                                <el-button
                                    v-if="scope.row.name != '超级管理员'"
                                    icon="ali-international-icon-certified-supplier"
                                    size="medium"
                                    @click="insert_permission.open(scope.row)"
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
                <span>
                    <el-input
                        v-model="new_role_name"
                        placeholder="请输入新的角色名"
                    ></el-input>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="insert_dialogVisible = false">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        :disabled="new_role_name == '' ? true : false"
                        @click="commit_insert_role"
                    >
                        提 交
                    </el-button>
                </span>
            </el-dialog>
            <my-el-dialog :dialog="insert_menu_dialog">
                <div class="mgb20">
                    <el-select
                        v-model="insert_menu_dialog.data.new_menu_id"
                        style="width: 100%"
                        placeholder="请选择要添加的菜单"
                    >
                        <el-option
                            v-for="menu in insert_menu_dialog.data.menus"
                            :key="menu.id"
                            :label="menu.path"
                            :value="menu.id"
                        >
                            <div class="flex">
                                <div class="flexg5">{{ menu.path }}</div>
                                <div class="flexg5">{{ menu.detail }}</div>
                            </div>
                        </el-option>
                    </el-select>
                </div>

                <!-- 已添加菜单列表 -->
                <my-el-table :el_table="insert_menu_dialog.table">
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
                                    insert_menu_dialog.remove_menu_dialog.open(
                                        scope.row,
                                    )
                                "
                            ></el-button>
                        </div>
                    </template>
                </my-el-table>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="insert_menu_dialog.close()">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="insert_menu_dialog.commit()"
                    >
                        提 交
                    </el-button>
                </span>
            </my-el-dialog>

            <!-- 修改 对话框 -->
            <el-dialog
                :title="update_dialog_title"
                :visible.sync="update_dialogVisible"
                width="30%"
                :close-on-click-modal="false"
                @close="handleClose"
            >
                <span>
                    <el-input
                        v-model="new_role_name"
                        placeholder="请输入新的角色名"
                    ></el-input>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="update_dialogVisible = false">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        :disabled="new_role_name == '' ? true : false"
                        @click="commit_update_role"
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
                <span>您确认要删除角色 {{ remove_role_name }} 吗？</span>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="remove_dialogVisible = false">
                        取 消
                    </el-button>
                    <el-button type="danger" @click="commit_remove">
                        确认删除
                    </el-button>
                </span>
            </el-dialog>

            <!-- 从角色删除菜单对话框 -->
            <my-el-dialog :dialog="insert_menu_dialog.remove_menu_dialog">
                <span>
                    您确认要删除菜单
                    {{
                        insert_menu_dialog.remove_menu_dialog.data.remove_menu
                            .path
                    }}
                    吗？
                </span>

                <span slot="footer" class="dialog-footer">
                    <el-button
                        @click="insert_menu_dialog.remove_menu_dialog.close()"
                    >
                        取 消
                    </el-button>
                    <el-button
                        type="danger"
                        @click="insert_menu_dialog.remove_menu_dialog.commit()"
                    >
                        确认删除
                    </el-button>
                </span>
            </my-el-dialog>

            <!-- 从角色删除权限对话框 -->
            <my-el-dialog :dialog="insert_permission.remove_permission">
                <span>
                    您确认要删除权限
                    {{
                        insert_permission.remove_permission.data
                            .remove_permission.name
                    }}
                    吗？
                </span>

                <span slot="footer" class="dialog-footer">
                    <el-button
                        @click="insert_permission.remove_permission.close()"
                    >
                        取 消
                    </el-button>
                    <el-button
                        type="danger"
                        @click="insert_permission.remove_permission.commit()"
                    >
                        确认删除
                    </el-button>
                </span>
            </my-el-dialog>

            <!-- 管理角色权限对话框 -->
            <my-el-dialog :dialog="insert_permission">
                <my-auto-completion-input
                    class="mgb10"
                    :el_autocompletion="insert_permission.auto_completion_input"
                    select_prop="name"
                >
                    <template v-slot="scope">
                        <div class="flex column pdt10 pdb10 pdl10 pdr10">
                            <div class="fs16">{{ scope.row.name }}</div>
                            <div class="fs14" style="color: #b4b4b4">
                                {{ scope.row.detail }}
                            </div>
                        </div>
                    </template>
                </my-auto-completion-input>
                <!-- 已添加权限列表 -->
                <my-el-table :el_table="insert_permission.table">
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
                                    insert_permission.remove_permission.open(
                                        scope.row,
                                    )
                                "
                            ></el-button>
                        </div>
                    </template>
                </my-el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="insert_permission.close()">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="insert_permission.do_commit()"
                    >
                        提 交
                    </el-button>
                </span>
            </my-el-dialog>
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
    add_menu_to_role,
    get_role_menus,
    remove_menu_from_role,
} from '@/api/role';

import { get_menu_list } from '@/api/menu';

import pageHeader from '@/views/common/page-header.vue';
import { when_unknow_err } from '@/utils';
import MyElDialog from '@/views/oop_components/MyElDialog.vue';
import MyAutoCompletionInput from '@/views/oop_components/MyAutoCompletionInput.vue';
import MyElTable from '@/views/oop_components/MyElTable.vue';

import { ElDialog, MyElCompletion, ElTable } from '@/lib';
import {
    get_permissions,
    insert_permission_for_role,
    remove_permission_from_role,
} from '@/api/permission';
import { Message } from 'element-ui';
var vue;
export default {
    components: {
        pageHeader,
        MyElDialog,
        MyAutoCompletionInput,
        MyElTable,
    },
    data() {
        return {
            insert_menu_dialog: new ElDialog('管理角色菜单', {
                remove_menu_dialog: new ElDialog('删除角色的菜单', {
                    reset_data() {
                        this.data = {
                            remove_menu: {},
                            remove_role: {},
                        };
                    },
                    enable_commit() {
                        return true;
                    },
                    do_commit(data) {
                        remove_menu_from_role(
                            this.data.remove_role.id,
                            this.data.remove_menu.id,
                            get_token(),
                            vue.idem_token,
                        ).then((resp) => {
                            Message.success('删除成功');
                            var data = { roleid: this.data.remove_role.id };
                            vue.insert_menu_dialog.table.fetch_data(data);
                            get_idem().then((idem) => {
                                vue.idem_token = idem;
                            });
                            this.close();
                        });
                    },
                    before_open(data) {
                        this.data.remove_menu = data;
                        this.data.remove_role =
                            vue.insert_menu_dialog.data.new_menu_role;
                        get_idem().then((idem) => {
                            vue.idem_token = idem;
                            this.do_open();
                        });
                    },
                }),
                reset_data() {
                    this.data = {
                        new_menu_role: {},
                        menus: [],
                        new_menu_id: undefined,
                    };
                },

                do_commit() {
                    // TODO
                    let roleid = this.data.new_menu_role.id;
                    let menuid = this.data.new_menu_id;
                    if (roleid == undefined || menuid == undefined) {
                        Message.warning('无效操作');
                        return;
                    }
                    var data = {
                        roleid: roleid,
                        menuid: menuid,
                    };
                    console.log('requst to add menu to role, params:', data);

                    // 添加菜单到角色
                    add_menu_to_role(data, get_token(), vue.idem_token)
                        .then((resp) => {
                            // 菜单列表添加角色
                            console.log(
                                '添加菜单',
                                this.new_menu_id,
                                '到角色：',
                                this.new_menu_role,
                            );

                            Message.success('添加成功');
                            get_idem().then((idem) => (vue.idem_token = idem));

                            var data = { roleid: this.data.new_menu_role.id };
                            this.table.fetch_data(data);
                        })
                        .catch((resp) => {
                            if (resp.code === 'ROLE_MENU_EXISTS') {
                                Message.warning('菜单已存在，请勿重复添加');
                                get_idem().then(
                                    (idem) => (vue.idem_token = idem),
                                );
                            } else {
                                when_unknow_err(resp.code, () => {});
                                get_idem().then(
                                    (idem) => (vue.idem_token = idem),
                                );
                            }
                        });
                },
                before_open(data) {
                    get_idem()
                        .then((idem) => {
                            this.data.new_menu_role = data;
                            vue.idem_token = idem;
                        })
                        .then((_) => {
                            var data = {};
                            console.log('打开新增菜单窗口，获取所有菜单列表');
                            return get_menu_list(data, get_token());
                        })
                        .then((resp) => {
                            var data = { roleid: this.data.new_menu_role.id };
                            this.data.menus = resp.data.menuList;
                            console.log('所有菜单：', this.data.menus);
                            this.do_open();
                            this.table.fetch_data(data);
                        })
                        .catch((resp) => when_unknow_err(resp.code, () => {}));
                },
                table: new ElTable('菜单列表', {
                    cols: [
                        {
                            prop: 'path',
                            label: '菜单路径',
                        },
                        {
                            prop: 'detail',
                            label: '菜单说明',
                        },

                        {
                            prop: undefined,
                            label: '操作',
                        },
                    ],
                    do_fetch_data(data) {
                        get_role_menus(data, get_token()).then((resp) => {
                            this.data = resp.data.menuList;
                            console.log(
                                'role:',
                                this.data.new_menu_role.name,
                                ' 的所有菜单：',
                                this.data.menus,
                            );
                        });
                    },
                }),
            }),
            insert_permission: new ElDialog('管理角色权限', {
                auto_completion_input: new MyElCompletion('默认内容', {
                    fetch_suggestions(query_string, cb) {
                        var params = {
                            name: vue.insert_permission.auto_completion_input
                                .value,
                        };
                        get_permissions(params, get_token()).then((resp) => {
                            console.log(this, 'hasjdflajskdjlfa;');

                            var resp_data = resp.data.permissionList;
                            var suggestions = [];
                            for (var item of resp_data) {
                                suggestions.push(item);
                            }

                            if (suggestions.length === 0) {
                                this.data.permission_found = false;
                            } else {
                                this.data.permission_found = true;
                            }
                            cb(suggestions);
                        });
                    },

                    value: '',

                    reset_data() {
                        this.value = '';
                        this.data = {
                            permission_found: false,
                        };
                    },

                    do_select(row) {
                        var insert_permission = row;
                        vue.insert_permission.data.insert_permission =
                            insert_permission;
                    },
                }),

                remove_permission: new ElDialog('从角色中删除权限', {
                    reset_data() {
                        this.data = {
                            remove_role: {},
                            remove_permission: {},
                        };
                    },
                    do_commit(data) {
                        let role_id = this.data.remove_role.id;
                        let permission_id = this.data.remove_permission.id;
                        if (
                            role_id == undefined ||
                            permission_id == undefined
                        ) {
                            Message.warning('无效操作');
                            return;
                        }

                        remove_permission_from_role(
                            this.data.remove_role.id,
                            this.data.remove_permission.id,
                            get_token(),
                            vue.idem_token,
                        )
                            .then((resp) => {
                                Message.success('删除成功');
                                vue.insert_permission.table.fetch_data(
                                    this.data.remove_role,
                                );
                                this.close();
                            })
                            .catch((resp) => {
                                get_idem().then(
                                    (idem) => (vue.idem_token = idem),
                                );
                                when_unknow_err(resp.code);
                            });
                    },
                    before_open(data) {
                        this.data.remove_permission = data;
                        this.data.remove_role =
                            vue.insert_permission.data.insert_permission_role;
                        get_idem().then((idem) => {
                            vue.idem_token = idem;
                            this.do_open();
                        });
                    },
                }),

                table: new ElTable('权限列表', {
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
                        if (data == undefined || data.id == undefined) {
                            Message.warning('无效操作');
                            return;
                        }
                        var req_data = {
                            roleid: data.id,
                        };
                        get_permissions(req_data, get_token()).then((resp) => {
                            var data_list = resp.data.permissionList;
                            this.data = [];
                            for (var item of data_list) {
                                this.data.push(item);
                            }
                        });
                    },
                }),

                reset_data() {
                    this.data = {
                        insert_permission: {},
                        insert_permission_role: {},
                    };
                },

                before_open(data) {
                    this.data.insert_permission_role = data;
                    this.table.fetch_data(data);
                    get_idem().then((idem) => {
                        vue.idem_token = idem;
                        this.do_open();
                    });
                },

                do_commit() {
                    var role = this.data.insert_permission_role;
                    var permission = this.data.insert_permission;
                    if (this.data.insert_permission == undefined) {
                        Message.warning('请选择要添加的权限');
                        return;
                    }

                    if (
                        this.auto_completion_input.data.permission_found ===
                        false
                    ) {
                        Message.warning('权限不存在');
                        return;
                    }
                    insert_permission_for_role(
                        role.id,
                        permission.id,
                        get_token(),
                        vue.idem_token,
                    )
                        .then((resp) => {
                            Message.success('添加成功');
                            this.table.fetch_data(role);
                            this.auto_completion_input.reset_data();
                        })
                        .catch((resp) => {
                            if (resp.code === 'NO_PERMISSION') {
                                Message.error('权限不存在,请刷新');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else if (
                                resp.code === 'PERMISSION_EXISTS_IN_ROLE'
                            ) {
                                Message.error('角色已存在该权限');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else if (resp.code === 'NO_ROLE') {
                                Message.error('角色不存在,请刷新');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else {
                                when_unknow_err(resp.code);
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            }
                        });
                },
            }),

            page_title: '用户角色',
            table_col_1: '角色名称',

            role_data: [],

            menus: [],

            pagesize: 10,
            pageno: 1,
            total: 0,

            idem_token: '',

            insert_dialog_title: '新增角色',
            insert_dialogVisible: false,
            new_role_name: '',

            remove_dialog_title: '删除角色',
            remove_dialogVisible: false,
            remove_role_name: '',

            update_dialog_title: '更新角色',
            update_dialogVisible: false,
            update_roleid: '',

            insert_menu_dialog_title: '管理角色菜单',
            insert_menu_dialogVisible: false,
            new_menu_id: undefined,
            new_menu_role: undefined,
            new_role_menus: [],
        };
    },

    created() {
        vue = this;
        this.fetch_data();
    },
    methods: {
        commit_insert_menu() {
            let roleid = this.new_menu_role.id;
            let menuid = this.new_menu_id;
            if (roleid == undefined || menuid == undefined) {
                Message.warning('无效操作');
                return;
            }
            var data = {
                roleid: this.new_menu_role.id,
                menuid: this.new_menu_id,
            };
            console.log('requst to add menu to role, params:', data);

            // 添加菜单到角色
            add_menu_to_role(data, get_token(), this.idem_token)
                .then((resp) => {
                    // 菜单列表添加角色
                    console.log(
                        '添加菜单',
                        this.new_menu_id,
                        '到角色：',
                        this.new_menu_role,
                    );

                    var new_menu = resp.data.newMenu;
                    this.new_role_menus.push(new_menu);

                    this.$message({
                        type: 'success',
                        message: '添加成功',
                    });

                    get_idem().then((idem) => {
                        this.idem_token = idem;
                    });
                })
                .catch((resp) => {
                    if (resp.code === 'ROLE_MENU_EXISTS') {
                        this.$message({
                            type: 'warning',
                            message: '菜单已存在，请勿重复添加',
                        });
                    } else {
                        when_unknow_err(resp.code, () => {});
                    }
                });
        },

        // 打开添加菜单到角色的对话框
        // open_add_menu_dialog(data) {
        //     get_idem()
        //         .then((idem) => {
        //             this.insert_menu_dialogVisible = true;
        //             this.new_menu_role = data;
        //             this.idem_token = idem;
        //         })
        //         .then((_) => {
        //             var data = {};
        //             console.log('打开新增菜单窗口，获取所有菜单列表');
        //             return get_menu_list(data, get_token());
        //         })
        //         .then((resp) => {
        //             var data = { roleid: this.new_menu_role.id };
        //             this.menus = resp.data.menuList;
        //             console.log('所有菜单：', this.menus);
        //             return get_role_menus(data, get_token());
        //         })
        //         .then((resp) => {
        //             this.new_role_menus = resp.data.menuList;
        //             console.log(
        //                 'role:',
        //                 this.new_menu_role.name,
        //                 ' 的所有菜单：',
        //                 this.menus,
        //             );
        //         })
        //         .catch((resp) => when_unknow_err(resp.code, () => {}));
        // },
        fetch_data() {
            var data = {};
            get_role_list(data, get_token()).then((resp) => {
                var role_data = resp.data.roleList;
                this.role_data = [];
                for (var role of role_data) {
                    this.role_data.push({
                        name: role.name,
                        id: role.id,
                    });
                }
            });
        },

        open_add_role() {
            get_idem()
                .then((idem) => {
                    this.insert_dialogVisible = true;
                    this.idem_token = idem;
                })
                .catch((resp) => when_unknow_err(resp.code, () => {}));
        },
        handleClose() {
            this.idem_token = '';
            this.update_roleid = undefined;
            this.new_role_name = '';
            this.new_menu_id = undefined;
            this.new_menu_role = undefined;
            this.new_role_menus = undefined;
            this.remove_role_name = '';
            this.insert_dialogVisible = false;
            this.remove_dialogVisible = false;
            this.update_dialogVisible = false;
            console.log('close dialog');
        },
        commit_insert_role() {
            var data = {
                roleName: this.new_role_name,
            };
            insert_role(data, get_token(), this.idem_token)
                .then((resp) => {
                    this.$message({
                        type: 'success',
                        message: '新增角色成功',
                    });
                    this.fetch_data();
                    this.new_role_name = '';
                    this.insert_dialogVisible = false;
                })
                .then((code) => {
                    // 再申请一次令牌
                    if (code == 'ROLE_EXISTS') {
                        this.$message({
                            type: 'warning',
                            message: '角色已存在',
                        });
                        get_idem().then((idem) => {
                            this.idem_token = idem;
                        });
                    }
                });
        },
        open_delete_dialog(row) {
            get_idem()
                .then((idem_token) => {
                    console.log(idem_token);
                    this.idem_token = idem_token;
                    this.remove_dialogVisible = true;
                    this.remove_role_name = row.name;
                })
                .catch((resp) => when_unknow_err(resp.code, () => {}));
        },

        commit_remove() {
            var data = {
                roleNames: [this.remove_role_name],
            };
            remove_role(data, get_token(), this.idem_token)
                .then((resp) => {
                    this.remove_dialogVisible = false;
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                    });
                    this.fetch_data();

                    return;
                })
                .catch((resp) => {
                    when_unknow_err(resp.code, () => {});
                });
        },
        open_edit_dialog(row) {
            this.update_roleid = row.id;
            this.new_role_name = row.name;
            get_idem().then((idem_token) => {
                console.log(idem_token);
                this.idem_token = idem_token;
                this.update_dialogVisible = true;
            });
        },
        commit_update_role() {
            var data = {
                roleName: this.new_role_name,
                roleid: this.update_roleid,
            };

            update_role(data, get_token(), this.idem_token)
                .then((resp) => {
                    this.$message({
                        type: 'success',
                        message: '修改角色成功',
                    });
                    this.fetch_data();
                    this.new_role_name = '';
                    this.update_dialogVisible = false;
                })
                .catch((resp) => {
                    get_idem().then((idem) => {
                        this.idem_token = idem;
                    });
                    if (resp.code == 'UPDATE_NO_CHANGE') {
                        this.$message({
                            type: 'warning',
                            message: '角色名未变更',
                        });
                    } else if (resp.code === 'ROLE_EXISTS') {
                        this.$message({
                            type: 'warning',
                            message: '角色名已存在',
                        });
                    } else {
                        when_unknow_err(resp.code);
                    }
                });
        },
    },
};
</script>

<style lang="scss">
@import '~@/styles/common-style.scss';
</style>
