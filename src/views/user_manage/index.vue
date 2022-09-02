<template>
    <div>
        <page-header :title="page_title"></page-header>

        <div class="" style="width: 90%; margin: 20px auto 0 auto">
            <!-- 多选栏 操作栏-->
            <div class="flex justify-between bc-b-gray">
                <div>
                    <input
                        class="mgb8 mgr20"
                        type="checkbox"
                        style="zoom: 150%"
                    />
                    <!-- <button
                        class="no-border mgb8 br5 click-css"
                        @click="open_add_role"
                    >
                        <i class="el-icon-plus pd8" style=""></i>
                    </button> -->
                </div>

                <div>
                    <div class="mgb8">
                        <el-pagination
                            layout="prev, pager, next"
                            :total="total"
                            :page-size="pagesize"
                            :current-page="pageno"
                            @current-change="turn_page"
                        ></el-pagination>
                    </div>
                </div>
            </div>

            <!-- 表格主体 -->
            <div>
                <el-table :data="user_data" style="width: 100%">
                    <!-- sam_account_name -->
                    <el-table-column
                        prop="sam_account_name"
                        :label="table_col_1"
                        min-width=""
                    ></el-table-column>
                    <!-- 用户组 -->
                    <el-table-column
                        prop="ou_list_text"
                        :label="table_col_2"
                        min-width=""
                    >
                        <template slot-scope="scope">
                            <div
                                v-if="
                                    scope.row.user_group != undefined &&
                                    scope.row.user_group.length != 0
                                "
                            >
                                <div
                                    v-for="group_str in scope.row.user_group"
                                    :key="group_str"
                                >
                                    {{ group_str }}
                                </div>
                            </div>

                            <div v-else>无</div>
                        </template>
                    </el-table-column>
                    <!-- 用户cn -->
                    <el-table-column
                        prop="cn"
                        :label="table_col_3"
                        min-width=""
                    >
                        <template slot-scope="scope">
                            <div
                                v-if="
                                    scope.row.cn != undefined &&
                                    scope.row.cn != ''
                                "
                            >
                                {{ scope.row.cn }}
                            </div>

                            <div v-else>无</div>
                        </template>
                    </el-table-column>
                    <!-- 用户角色 -->
                    <el-table-column
                        prop="roles"
                        :label="table_col_4"
                        min-width=""
                    >
                        <template slot-scope="scope">
                            <!-- 如果用户没有角色 -->
                            <div
                                v-if="
                                    scope.row.roles == undefined ||
                                    scope.row.roles.length == 0
                                "
                            >
                                <el-tag
                                    class="mgr8 fs14 mgb8"
                                    :disable-transitions="true"
                                >
                                    无角色
                                </el-tag>
                                <!-- 添加用户角色 -->
                                <el-button
                                    class="fs14"
                                    size="small"
                                    @click="open_insert_dialog(scope.row)"
                                >
                                    + 新增
                                </el-button>
                            </div>
                            <!-- 如果用户有角色，则列出 -->
                            <div v-else>
                                <!-- 用户角色列表 -->
                                <el-tag
                                    v-for="role in scope.row.roles"
                                    :key="role.name"
                                    class="mgr8 fs14 mgb8"
                                    closable
                                    :disable-transitions="true"
                                    @close="
                                        handle_tag_close({
                                            role: role,
                                            user: scope.row,
                                        })
                                    "
                                >
                                    {{ role.name }}
                                </el-tag>
                                <!-- 添加用户角色 -->
                                <el-button
                                    class="fs14"
                                    size="small"
                                    @click="open_insert_dialog(scope.row)"
                                >
                                    + 新增
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column>
                        <template slot-scope="scope">
                            <div class="flex">
                                <el-button
                                    @click="open_delete_dialog(scope.row)"
                                    size="medium"
                                    circle
                                >
                                    <i class="el-icon-s-custom"></i>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column> -->
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
                    <el-select
                        v-model="new_role_id"
                        style="width: 100%"
                        placeholder="请选择角色"
                    >
                        <el-option
                            v-for="role in roles"
                            :key="role.id"
                            :label="role.name"
                            :value="role.id"
                        ></el-option>
                    </el-select>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="insert_dialogVisible = false">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        :disabled="new_role_id == undefined ? true : false"
                        @click="commit_add"
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
                    您确认要删除角色
                    {{ remove_role.name == undefined ? '' : remove_role.name }}
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
var vue;
import { get_token, get_idem } from '@/utils/auth';
import { get_role_list } from '@/api/role';
import { resolve_ou_list } from '@/utils/user';
import { get_user_page, add_role_to_user, remove_user_role } from '@/api/user';
import pageHeader from '../common/page-header.vue';
import { Message } from 'element-ui';
import { when_unknow_err } from '@/utils';
export default {
    components: { pageHeader },
    data() {
        return {
            page_title: '用户权限',
            table_col_1: 'sAMAccountName',
            table_col_2: '用户组',
            table_col_3: '用户名',
            table_col_4: '用户角色',
            table_col_5: '角色名称',
            table_col_6: '角色名称',
            table_col_7: '角色名称',

            user_data: [],
            roles: [],

            new_role_name: '',

            pagesize: 10,
            pageno: 1,
            total: 0,

            idem_token: '',

            insert_dialog_title: '新增角色',
            insert_dialogVisible: false,
            new_role_id: undefined,
            new_role_user: {},

            remove_dialog_title: '删除角色',
            remove_dialogVisible: false,
            remove_role_user: {},
            remove_role: {},

            update_dialog_title: '更新角色',
            update_dialogVisible: false,
            update_roleid: '',
        };
    },

    created() {
        vue = this;
        this.fetch_data();
    },
    methods: {
        // 提交删除用户角色
        commit_remove() {
            this.del_role();
        },
        // 提交按钮回调
        commit_add() {
            this.add_user_role();
        },

        // 关闭tag的回调
        handle_tag_close(data) {
            this.open_delete_dialog(data);
        },

        // 增加角色
        add_user_role() {
            console.log('requst to add role to user');
            var data = {
                userid: this.new_role_user.id,
                roleid: this.new_role_id,
            };

            add_role_to_user(data, get_token(), this.idem_token)
                .then((resp) => {
                    // 用户角色列表添加角色
                    console.log('用户角色列表中添加角色：', new_role);
                    var new_role = resp.data.role;
                    vue.new_role_user.roles.push(new_role);

                    Message.success('添加成功');
                    vue.insert_dialogVisible = false;
                })
                .catch((resp) => {
                    if (resp.code === 'INSERT_EXISTS') {
                        Message.warning('角色已存在，请勿重复添加');
                        get_idem().then((idem) => (this.idem_token = idem));
                        return;
                    } else if (
                        resp.code === 'CAN_NOT_ADD_SUPER_ADMIN_TO_USER'
                    ) {
                        Message.warning('不能向用户添加超级管理员角色');
                        get_idem().then((idem) => (this.idem_token = idem));
                        return;
                    }
                    get_idem().then((idem) => (this.idem_token = idem));
                    when_unknow_err(resp.code);
                });
        },

        // 删除用户角色
        del_role() {
            let roleid = this.remove_role.id;
            let userid = this.remove_role_user.id;
            if (roleid == undefined || userid == undefined) {
                Message.warning('操作无效');
                return;
            }
            var data = {
                roleid: this.remove_role.id,
                userid: this.remove_role_user.id,
            };
            console.log('发送请求删除用户角色，参数：', data);
            remove_user_role(data, get_token(), this.idem_token)
                .then((resp) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                    });
                    // 从用户角色列表中删除角色
                    var user_roles = this.remove_role_user.roles;
                    console.log(
                        '从用户角色列表',
                        user_roles,
                        '中删除角色',
                        this.remove_role.name,
                    );

                    if (user_roles != undefined && user_roles.length != 0) {
                        var remove_idx = user_roles.findIndex(
                            (role) => role.id == vue.remove_role.id,
                        );
                        console.log(
                            '删除用户角色列表：',
                            user_roles,
                            '中index为：',
                            remove_idx,
                            '的元素',
                        );
                        var roles_after_remove = user_roles.splice(
                            remove_idx,
                            1,
                        );
                        console.log(
                            '删除后的用户角色列表：',
                            roles_after_remove,
                        );
                    }

                    // 关闭对话框
                    this.remove_dialogVisible = false;
                    return;
                })
                .catch((resp) => {
                    when_unknow_err(
                        resp.code,
                        () => (vue.remove_dialogVisible = false),
                    );
                });
        },
        turn_page(cur_page) {
            this.pageno = cur_page;
            this.fetch_data();
        },
        fetch_data() {
            var data = { pageNo: this.pageno, pageSize: this.pageSize };
            get_user_page(data, get_token())
                .then((resp) => {
                    console.log('获取用户列表：', resp.data.userList);
                    this.total = resp.data.total;
                    var user_data = resp.data.userList;
                    this.user_data = [];
                    for (var user of user_data) {
                        var ouDnListJson = user.ouDnList;
                        // 如果用户没有dn，那么不解析
                        if (ouDnListJson == undefined) {
                            console.log('用户', user, '没有ou，不解析');
                            this.user_data.push({
                                roles: user.roles,
                                cn: user.cn,
                                sam_account_name: user.samAccountName,
                                id: user.id,
                            });
                            continue;
                        }
                        var oulist = resolve_ou_list(ouDnListJson);
                        console.log('解析oulist:', ouDnListJson, '=>', oulist);
                        console.log('开始拼接用户组的字符串');
                        var user_group = [];
                        for (var ou_path_array of oulist) {
                            var ou_path_str = '';
                            for (var ou_path_node of ou_path_array) {
                                ou_path_str += ou_path_node += ' ';
                            }
                            user_group.push(ou_path_str);
                            console.log('拼接ou字符串：', ou_path_str);
                        }
                        console.log('用户：', user, '所在的组：', user_group);

                        this.user_data.push({
                            user_group: user_group,
                            // oulist: oulist,
                            roles: user.roles,
                            cn: user.cn,
                            sam_account_name: user.samAccountName,
                            id: user.id,
                        });
                    }
                })
                .catch((resp) => {
                    when_unknow_err(resp.code);
                });
        },

        // 打开增加角色窗口
        open_insert_dialog(data) {
            get_idem()
                .then((idem) => {
                    this.insert_dialogVisible = true;
                    this.new_role_user = data;
                    this.idem_token = idem;
                })
                .then((_) => {
                    var data = {};
                    console.log('打开新增角色窗口，获取所有角色列表');
                    return get_role_list(data, get_token());
                })
                .then((resp) => {
                    console.log('所有角色：', resp.data.roleList);
                    this.roles = resp.data.roleList;
                    return;
                })
                .catch((resp) => {
                    when_unknow_err(resp.code);
                });
        },

        open_delete_dialog(data) {
            if (data.role.name == '超级管理员') {
                this.$message.warning('超级管理员不能删除');
                return;
            }
            get_idem().then((idem) => {
                this.remove_role = data.role;
                this.remove_role_user = data.user;
                this.idem_token = idem;
                this.remove_dialogVisible = true;
            });
        },

        handleClose() {
            this.idem_token = '';
            this.update_roleid = undefined;
            this.new_role_id = undefined;
            this.new_role_user = {};
            this.insert_dialogVisible = false;
            this.remove_dialogVisible = false;
            this.remove_role_user = {};
            this.remove_role = {};
            this.remove_dialogVisible = false;
            this.update_dialogVisible = false;
            console.log('close dialog');
        },
    },
};
</script>

<style lang="scss">
@import '~@/styles/common-style.scss';
</style>
