<template>
    <div>
        <page-header :title="page_title"></page-header>

        <!-- 用户信息 -->
        <div class="" style="width: 90%; margin: 20px auto 0 auto">
            <!-- 昵称 -->
            <div class="flex mgb20">
                <div class="flexg1 pdt10"><span>昵称：</span></div>

                <el-input
                    v-model="user_info.nickname"
                    class="flexg3 fs16"
                    placeholder="新昵称"
                ></el-input>
                <!-- 空格 -->
                <div class="flexg1"></div>
                <!-- 更改按钮 -->
                <div class="flexg5">
                    <el-button type="primary" @click="commit_update_btn">
                        提交更改
                    </el-button>
                </div>
            </div>

            <!-- 账号 -->
            <div class="flex mgb20">
                <div class="flexg1"><span>账号：</span></div>
                <div class="flexg9 pdl15">
                    <span>{{ user_info.samAccountName }}</span>
                </div>
            </div>

            <!-- 邮箱 -->
            <div class="flex mgb20">
                <div class="flexg1"><span>邮箱：</span></div>
                <div class="flexg9 pdl15">
                    <span v-if="user_info.mail != undefined">
                        {{ user_info.mail }}
                    </span>
                    <span v-else>无</span>
                </div>
            </div>

            <!-- 我所在的组 -->
            <div class="flex mgb20">
                <div class="flexg1 pdt10"><span>组：</span></div>
                <div
                    v-if="
                        user_info.user_ou_str_list != undefined &&
                            user_info.user_ou_str_list.length != 0
                    "
                    class="flexg9 pdl15"
                >
                    <el-tag
                        v-for="ou_str in user_info.user_ou_str_list"
                        :key="ou_str"
                        class="mgr8 fs16"
                        effect="dark"
                    >
                        {{ ou_str }}
                    </el-tag>
                </div>
                <div v-else class="flexg9 pdl15">无</div>
            </div>

            <!-- 角色 -->
            <div class="flex mgb20">
                <div class="flexg1 pdt10"><span>角色：</span></div>

                <div class="flexg9 pdl15">
                    <div
                        v-if="
                            user_info.roles == undefined ||
                                user_info.roles.length == 0
                        "
                    >
                        <el-tag class="mgr8 fs14" :disable-transitions="true">
                            无角色
                        </el-tag>
                    </div>
                    <!-- 用户角色列表 -->
                    <div v-else>
                        <el-tag
                            v-for="role in user_info.roles"
                            :key="role.name"
                            class="mgr8 fs14"
                            :disable-transitions="true"
                        >
                            {{ role.name }}
                        </el-tag>
                    </div>
                </div>
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
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button
                        type="primary"
                        :disabled="
                            new_role_name != undefined && new_role_name != ''
                                ? true
                                : false
                        "
                        @click="commit_insert_role"
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
        </div>
    </div>
</template>

<script>
import { get_token, get_idem, get_idem_async } from '@/utils/auth';

import {
    resolve_ou_list,
    parse_user_group_metrix_to_string_list,
} from '@/utils/user';
import {
    get_role_list,
    insert_role,
    remove_role,
    update_role,
} from '@/api/role';

import { fetch_user_info, update_user_nickname } from '@/api/user';
import pageHeader from '../common/page-header.vue';
import { Message } from 'element-ui';
import { when } from 'q';
import { when_unknow_err } from '@/utils';
export default {
    components: { pageHeader },
    data() {
        return {
            user_info: {},
            nickname: 'default_name',

            page_title: '我的信息',
            table_col_1: '角色名称',

            role_data: [],

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
        };
    },

    created() {
        this.fetch_data();
    },
    methods: {
        commit_update_btn() {
            if (
                this.user_info.nickname == '' ||
                this.user_info.nickname == undefined
            ) {
                this.$message.warning('昵称不能为空');
                return;
            }
            this.change_nick_name();
        },
        change_nick_name() {
            var data = {
                nickname: this.user_info.nickname,
                userid: this.user_info.id,
            };

            console.log('提交修改用户昵称申请，参数：', data);
            update_user_nickname(data, get_token())
                .then((resp) => {
                    this.$message({
                        type: 'success',
                        message: '修改成功',
                    });
                    console.log('用户昵称修改成功');
                })
                .catch((resp) => {
                    when_unknow_err(resp.code, (_) => {});
                });
        },
        fetch_data() {
            fetch_user_info(get_token())
                .then((resp) => {
                    console.log('用户信息获取成功：', resp.data.userInfo);
                    this.user_info = resp.data.userInfo;
                    console.log('处理用户ou信息');
                    var ou_dn_list = resp.data.userInfo.ouDnList;
                    if (ou_dn_list != undefined && ou_dn_list != '') {
                        var user_ou_list = resolve_ou_list(ou_dn_list);
                        console.log('用户ou信息：', user_ou_list);

                        var user_ou_str_list =
                            parse_user_group_metrix_to_string_list(
                                user_ou_list,
                            );
                        console.log('用户ou信息：', user_ou_str_list);
                        this.user_info.user_ou_str_list = user_ou_str_list;
                    }
                })
                .catch((resp) => {
                    when_unknow_err(resp.code, (_) => {});
                });
        },

        open_add_role() {
            get_idem()
                .then((idem) => {
                    this.insert_dialogVisible = true;
                    this.idem_token = idem;
                })
                .catch((code) => {
                    this.$message.error('error code: ' + code);
                });
        },
        handleClose() {
            this.idem_token = '';
            this.update_roleid = undefined;
            this.new_role_name = '';
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
                .then((resp) => {
                    // 再申请一次令牌
                    if (resp.code == 'ROLE_EXISTS') {
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
                .catch((code) => this.$message.error('error code:' + code));
        },

        commit_remove() {
            var data = {
                roleNames: [this.remove_role_name],
            };
            remove_role(data, get_token(), this.idem_token).then((resp) => {
                if (resp.code == 'SUCCESS') {
                    this.remove_dialogVisible = false;
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                    });
                    this.fetch_data();

                    return;
                }

                x;
                this.remove_dialogVisible = false;
                this.$message({
                    type: 'error',
                    message: 'error code ' + resp.code,
                });
                return;
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
                    Message.success('修改角色成功');
                    this.fetch_data();
                    this.update_dialogVisible = false;
                })
                .catch((resp) => {
                    if (resp.code == 'UPDATE_NO_CHANGE') {
                        Message.warning('角色名未变更');
                        get_idem().then((idem) => {
                            this.idem_token = idem;
                        });
                    } else {
                        when_unknow_err(resp.code, (_) => {});
                    }
                });
        },
    },
};
</script>

<style lang="scss">
@import '~@/styles/common-style.scss';
</style>
