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
                    <button
                        class="no-border mgb8 br5 click-css"
                        @click="open_add_dialog"
                    >
                        <i class="el-icon-plus pd8" style=""></i>
                    </button>
                </div>

                <div>
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
            </div>

            <!-- 表格主体 -->
            <div>
                <el-table :data="page_data" style="width: 100%">
                    <el-table-column
                        prop="path"
                        :label="table_col_1"
                    ></el-table-column>
                    <el-table-column
                        prop="detail"
                        :label="table_col_2"
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
                    <span>
                        <el-input
                            v-model="new_menu_path"
                            placeholder="请输入新的菜单路径"
                            @keyup.enter.native="commit_insert"
                        ></el-input>
                    </span>
                </div>
                <div>
                    <span>
                        <el-input
                            v-model="new_menu_detail"
                            placeholder="请输入新的菜单说明"
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
                            new_menu_path == '' || new_menu_path == ''
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
                <div class="mgb10">
                    <el-input
                        v-model="update_menu_path"
                        placeholder="请输入新的菜单路径"
                    ></el-input>
                </div>

                <div>
                    <el-input
                        v-model="update_menu_detail"
                        placeholder="请输入新的菜单描述"
                    ></el-input>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="update_dialogVisible = false">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        :disabled="update_menu_path !== '' ? false : true"
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
                    您确认要删除菜单
                    {{ remove_menu == undefined ? '' : remove_menu.path }}
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

export default {
    components: {
        pageHeader,
    },
    data() {
        return {
            page_title: '菜单管理',
            table_col_1: '菜单路径',
            table_col_2: '菜单说明',

            page_data: [],

            pagesize: 10,
            pageno: 1,
            total: 0,

            idem_token: '',

            insert_dialog_title: '新增菜单配置',
            insert_dialogVisible: false,
            new_menu_path: '',
            new_menu_detail: '',

            remove_dialog_title: '删除菜单',
            remove_dialogVisible: false,
            remove_role_name: '',
            remove_menu: undefined,

            update_dialog_title: '更新角色',
            update_dialogVisible: false,
            update_roleid: '',
            update_menu: {},
            update_menu_id: '',
            update_menu_path: '',
            update_menu_detail: '',
        };
    },

    created() {
        this.fetch_data();
    },
    methods: {
        page(pageno) {
            this.pageno = pageno;
            this.fetch_data();
        },
        fetch_data() {
            var data = { pageSize: this.pagesize, pageNo: this.pageno };
            get_menu_page(data, get_token()).then((resp) => {
                var page_data = resp.data.menuList;
                this.page_data = [];
                for (var data of page_data) {
                    this.page_data.push({
                        path: data.path,
                        detail: data.detail,
                        id: data.id,
                    });
                }
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
            console.log('close dialog');
        },
        commit_insert() {
            this.insert_menu();
        },
        insert_menu() {
            if (this.new_menu_path == undefined || this.new_menu_path == '') {
                Message.warning('path必填');
                return;
            }
            var data = {
                path: this.new_menu_path,
                detail: this.new_menu_detail,
            };
            insert_menu(data, get_token(), this.idem_token)
                .then((resp) => {
                    Message.success('新增菜单成功');
                    this.fetch_data();
                    this.insert_dialogVisible = false;
                })
                .catch((resp) => {
                    if (resp.code == 'MENU_EXSITS') {
                        this.$message({
                            type: 'warning',
                            message: '菜单已存在',
                        });
                        get_idem().then((idem) => {
                            this.idem_token = idem;
                        });
                        return;
                    }
                    when_unknow_err(resp.code);
                });
        },

        open_delete_dialog(row) {
            get_idem().then((idem_token) => {
                console.log(idem_token);
                this.idem_token = idem_token;
                this.remove_dialogVisible = true;
                this.remove_menu = row;
            });
        },

        commit_remove() {
            var data = {
                menuidList: this.remove_menu.id,
            };
            remove_menu(data, get_token(), this.idem_token)
                .then((resp) => {
                    this.remove_dialogVisible = false;
                    Message.success('删除成功');
                    this.fetch_data();
                })
                .catch((resp) => {
                    when_unknow_err(resp.code, () => {});
                });
        },
        open_edit_dialog(row) {
            this.update_menu_id = row.id;
            this.update_menu_path = row.path;
            this.update_menu_detail = row.detail;
            get_idem().then((idem_token) => {
                console.log(idem_token);
                this.idem_token = idem_token;
                this.update_dialogVisible = true;
            });
        },
        commit_update() {
            var data = {
                path: this.update_menu_path,
                detail: this.update_menu_detail,
            };
            var menuid = this.update_menu_id;
            update_menu(menuid, data, get_token(), this.idem_token)
                .then((resp) => {
                    Message.success('修改菜单成功');
                    this.fetch_data();
                    this.update_dialogVisible = false;
                })
                .catch((resp) => {
                    if (resp.code == 'NO_MENU') {
                        Message.warning('菜单项不存在');
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
