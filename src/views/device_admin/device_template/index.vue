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
                                <!-- 修改模板按钮 -->
                                <el-button
                                    icon="el-icon-edit"
                                    size="medium"
                                    circle
                                    @click="update.open(scope.row)"
                                ></el-button>
                                <!-- 删除模板按钮 -->
                                <el-button
                                    icon="el-icon-delete"
                                    size="medium"
                                    circle
                                    @click="remove.open(scope.row)"
                                ></el-button>

                                <el-button
                                    icon="el-icon-info"
                                    size="medium"
                                    circle
                                    @click="info.open(scope.row)"
                                ></el-button>
                            </div>
                        </div>
                    </template>
                </my-el-table>
            </div>

            <!-- 修改 对话框 -->
            <my-el-dialog :dialog="update" width="50%">
                <div class="mgb10">模板名称</div>
                <div class="mgb10">
                    <!-- 模板名称 -->
                    <span>
                        <el-input
                            v-model="update.data.new_template_name"
                            placeholder="请输入新的模板名称"
                        ></el-input>
                    </span>
                </div>

                <div>
                    <!-- 必须字段列表 -->
                    <div
                        class="mgb10"
                        :key="rquired_entry.count"
                        v-for="rquired_entry in update.data.required_field_list"
                    >
                        <div class="mgb10">修改字段</div>
                        <div class="flex">
                            <!-- 字段名称 -->
                            <div class="flexg5">
                                <div>
                                    <el-input
                                        disabled
                                        v-model="rquired_entry.name"
                                        placeholder="请输入字段名称"
                                    ></el-input>
                                </div>
                            </div>
                            <!-- 字段类型 -->
                            <div class="flexg3">
                                <div class="mgl8">
                                    <el-select
                                        disabled
                                        v-model="rquired_entry.data_type_id"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="item in update.data
                                                .data_type_list"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <!-- 字段是否必须 -->
                            <div class="flexg2">
                                <div class="mgl8" style="line-height: 2.5">
                                    <el-checkbox
                                        disabled
                                        v-model="rquired_entry.must_answer"
                                    >
                                        是否必需
                                    </el-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="mgb10"
                        :key="new_entry.count"
                        v-for="new_entry in update.data.update_entry_list"
                    >
                        <div class="mgb10">修改字段</div>
                        <!-- 字段名称 -->
                        <div class="flex">
                            <div class="flexg5">
                                <div>
                                    <el-input
                                        v-model="new_entry.name"
                                        placeholder="请输入字段名称"
                                    ></el-input>
                                </div>
                            </div>
                            <!-- 字段类型 -->
                            <div class="flexg3">
                                <div class="mgl8">
                                    <el-select
                                        disabled
                                        v-model="new_entry.data_type_id"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="item in update.data
                                                .data_type_list"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <!-- 字段是否必须 -->
                            <div class="flexg2">
                                <div class="mgl8" style="line-height: 2.5">
                                    <el-checkbox
                                        v-model="new_entry.must_answer"
                                    >
                                        是否必需
                                    </el-checkbox>
                                </div>
                            </div>

                            <!-- 删除字段 -->
                            <div class="flexg2">
                                <div class="mgl8">
                                    <el-button
                                        :disabled="
                                            new_entry.hardcode_entry === true
                                        "
                                        icon="el-icon-delete"
                                        circle
                                        @click="
                                            update_delete_entry(
                                                new_entry,
                                                'remove_old',
                                            )
                                        "
                                    ></el-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="mgb10"
                        :key="new_entry.count"
                        v-for="new_entry in update.data.new_entry_list"
                    >
                        <div class="mgb10">新增字段</div>
                        <!-- 字段名称 -->
                        <div class="flex">
                            <div class="flexg5">
                                <div>
                                    <el-input
                                        v-model="new_entry.name"
                                        placeholder="请输入字段名称"
                                    ></el-input>
                                </div>
                            </div>
                            <!-- 字段类型 -->
                            <div class="flexg3">
                                <div class="mgl8">
                                    <el-select
                                        v-model="new_entry.data_type_id"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="item in update.data
                                                .data_type_list"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <!-- 字段是否必须 -->
                            <div class="flexg2">
                                <div class="mgl8" style="line-height: 2.5">
                                    <el-checkbox
                                        v-model="new_entry.must_answer"
                                    >
                                        是否必需
                                    </el-checkbox>
                                </div>
                            </div>

                            <!-- 删除字段 -->
                            <div class="flexg2">
                                <div class="mgl8">
                                    <el-button
                                        icon="el-icon-delete"
                                        circle
                                        @click="
                                            update_delete_entry(
                                                new_entry,
                                                'remove_new',
                                            )
                                        "
                                    ></el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <el-button
                        style="width: 100%"
                        type="primary"
                        icon="el-icon-plus"
                        @click="update_add_one_new_entry"
                    ></el-button>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="update.close()">取 消</el-button>
                    <el-button type="primary" @click="update.commit()">
                        提 交
                    </el-button>
                </span>
            </my-el-dialog>

            <!-- 添加 对话框 -->
            <my-el-dialog :dialog="insert">
                <div class="mgb10">模板名称</div>
                <div class="mgb10">
                    <!-- 模板名称 -->
                    <span>
                        <el-input
                            v-model="insert.data.new_template_name"
                            placeholder="请输入新的模板名称"
                        ></el-input>
                    </span>
                </div>
                <!-- TODO -->
                <div>
                    <!-- 必须字段列表 -->
                    <div
                        class="mgb10"
                        :key="rquired_entry.count"
                        v-for="rquired_entry in insert.data.required_field_list"
                    >
                        <div class="mgb10">新增字段</div>
                        <div class="flex">
                            <!-- 字段名称 -->
                            <div class="flexg5">
                                <div>
                                    <el-input
                                        disabled
                                        v-model="rquired_entry.name"
                                        placeholder="请输入字段名称"
                                    ></el-input>
                                </div>
                            </div>
                            <!-- 字段类型 -->
                            <div class="flexg3">
                                <div class="mgl8">
                                    <el-select
                                        disabled
                                        v-model="rquired_entry.data_type_id"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="item in insert.data
                                                .data_type_list"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <!-- 字段是否必须 -->
                            <div class="flexg2">
                                <div class="mgl8" style="line-height: 2.5">
                                    <el-checkbox
                                        disabled
                                        v-model="rquired_entry.must_answer"
                                    >
                                        是否必需
                                    </el-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 新增字段 -->
                    <div
                        class="mgb10"
                        :key="new_entry.count"
                        v-for="new_entry in insert.data.entry_list"
                    >
                        <div class="mgb10">新增字段</div>
                        <div class="flex">
                            <!-- 字段名称 -->
                            <div class="flexg5">
                                <div>
                                    <el-input
                                        v-model="new_entry.name"
                                        placeholder="请输入字段名称"
                                    ></el-input>
                                </div>
                            </div>
                            <!-- 字段类型 -->
                            <div class="flexg3">
                                <div class="mgl8">
                                    <el-select
                                        v-model="new_entry.data_type_id"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="item in insert.data
                                                .data_type_list"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <!-- 字段是否必须 -->
                            <div class="flexg2">
                                <div class="mgl8" style="line-height: 2.5">
                                    <el-checkbox
                                        v-model="new_entry.must_answer"
                                    >
                                        是否必需
                                    </el-checkbox>
                                </div>
                            </div>
                            <!-- 删除字段 -->
                            <div class="flexg2">
                                <div class="mgl8">
                                    <el-button
                                        icon="el-icon-delete"
                                        circle
                                        @click="insert_delete_entry(new_entry)"
                                    ></el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <el-button
                        style="width: 100%"
                        type="primary"
                        icon="el-icon-plus"
                        @click="add_one_new_entry"
                    ></el-button>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="insert.close()">取 消</el-button>
                    <el-button type="primary" @click="insert.commit()">
                        提 交
                    </el-button>
                </span>
            </my-el-dialog>

            <!-- 查看模板详情 -->
            <my-el-dialog :dialog="info" :width="'50%'">
                <div class="mgb10">模板ID</div>
                <div class="mgb10">
                    <span>
                        <el-input
                            disabled
                            v-model="info.data.template_id"
                            placeholder=""
                        ></el-input>
                    </span>
                </div>
                <div class="mgb10">模板名称</div>
                <div class="mgb10">
                    <!-- 模板名称 -->
                    <span>
                        <el-input
                            disabled
                            v-model="info.data.template_name"
                            placeholder=""
                        ></el-input>
                    </span>
                </div>

                <!-- 已添加API资源列表 -->
                <my-el-table :el_table="info.table">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row[scope.col.prop] }}
                        </div>
                    </template>
                </my-el-table>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="info.close()">取 消</el-button>
                </span>
            </my-el-dialog>

            <!-- 删除对话框 -->
            <my-el-dialog :dialog="remove">
                <span>
                    您确认要删除设备模板 '{{
                        remove.data.remove_template.name
                    }}' 吗？
                </span>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="remove.close()">取 消</el-button>
                    <el-button type="danger" @click="remove.commit()">
                        确认删除
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
import { ElDialog, ElTable, MyElCompletion } from '@/lib/index';

import { cloneDeep } from '@/utils/route';
import MyElTable from '../../oop_components/MyElTable.vue';
import MyElDialog from '../../oop_components/MyElDialog.vue';
import {
    create_device_template,
    get_device_template_data_type_list,
    get_device_template_list,
    remove_device_template,
    update_device_template,
    get_device_template_required_field_list,
} from '@/api/device';
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
            page_title: '设备模板管理',
            table: new ElTable('模板表格', {
                cols: [
                    {
                        prop: 'name',
                        label: '模板名称',
                    },
                    {
                        prop: 'serial_number',
                        label: '模板序列号',
                    },
                    {
                        prop: undefined,
                        label: '操作',
                    },
                ],

                do_fetch_data(data) {
                    var req_data = { template_id_list: '' };
                    get_device_template_list(req_data, get_token()).then(
                        (resp) => {
                            var page_data = resp.data.deviceTemplateList;
                            this.data = [];
                            if (
                                page_data != undefined &&
                                page_data.length != 0
                            ) {
                                for (var data of page_data) {
                                    this.data.push({
                                        name: data.name,
                                        serial_number: data.serialNumber,
                                        id: data.id,
                                    });
                                }
                            }
                        },
                    );
                },
            }),

            page_data: [],

            pagesize: 10,
            pageno: 1,
            total: 0,

            idem_token: '',

            insert: new ElDialog('新建模板', {
                reset_data() {
                    this.data = {
                        counter: 0,
                        required_field_list: [],
                        data_type_list: [],
                        entry_counter: 0,
                        new_template_name: '',
                        entry_list: [],
                    };
                },
                enable_commit() {
                    if (
                        this.data.new_template_name === '' ||
                        this.data.new_template_name == undefined
                    ) {
                        return false;
                    }

                    var new_entry_list = this.data.entry_list;
                    for (var i = 0; i < new_entry_list.length; i++) {
                        var new_entry = new_entry_list[i];
                        if (
                            new_entry.data_type_id == undefined ||
                            new_entry.must_answer == undefined ||
                            new_entry.name == undefined ||
                            new_entry.name === ''
                        ) {
                            return false;
                        }
                    }
                    return true;
                },

                before_open(data) {
                    get_device_template_data_type_list(get_token())
                        .then((resp) => {
                            this.data.data_type_list = resp.data.dataTypeList;
                            return get_device_template_required_field_list(
                                get_token(),
                            );
                        })
                        .then((resp) => {
                            let required_field_list =
                                resp.data.deviceTemplateRequiredFieldList;
                            for (
                                let i = 0;
                                i < required_field_list.length;
                                i++
                            ) {
                                const required_field = required_field_list[i];
                                let count = this.data.counter++;
                                required_field.count = count;
                                required_field.must_answer =
                                    required_field.mustAnswer === 1
                                        ? true
                                        : false;
                                required_field.data_type_id =
                                    required_field.dataTypeId;
                            }
                            this.data.required_field_list = required_field_list;
                            return get_idem();
                        })
                        .then((idem) => {
                            vue.idem_token = idem;
                            this.do_open();
                        });
                },
                do_commit() {
                    var entry_list = cloneDeep(this.data.entry_list);
                    entry_list = entry_list.map((entry) => {
                        return {
                            name: entry.name,
                            mustAnswer: entry.must_answer === false ? 0 : 1,
                            dataTypeId: entry.data_type_id,
                        };
                    });

                    var data = {
                        name: this.data.new_template_name,
                        templateEntries: entry_list,
                    };

                    create_device_template(data, get_token(), vue.idem_token)
                        .then((resp) => {
                            Message.success('添加成功');
                            vue.table.fetch_data();
                            this.close();
                        })
                        .catch((resp) => {
                            if (resp.code === 'TEMPLATE_ENTRY_NAME_DUPLICATE') {
                                Message.warning('模板字段同名');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else if (resp.code === 'DEVICE_TEMPLATE_EXISTS') {
                                Message.warning('同名模板已存在');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else {
                                when_unknow_err(resp.code);
                            }
                        });
                },
            }),

            remove: new ElDialog('删除模板', {
                enable_commit() {
                    return true;
                },
                reset_data() {
                    this.data = {
                        remove_template: {
                            name: '',
                            id: undefined,
                        },
                    };
                },

                before_open(data) {
                    data = cloneDeep(data);
                    get_idem().then((idem) => {
                        this.data.remove_template.name = data.name;
                        this.data.remove_template.id = data.id;
                        this.visible = true;
                        vue.idem_token = idem;
                        this.do_open(data);
                    });
                },

                do_commit() {
                    var template_id = this.data.remove_template.id;
                    remove_device_template(
                        template_id,
                        get_token(),
                        vue.idem_token,
                    )
                        .then((resp) => {
                            Message.success('删除成功');
                            vue.table.fetch_data();
                            this.close();
                        })
                        .catch((resp) => {
                            if (resp.code === 'DEVICE_TEMPLATE_EXISTS') {
                                Message.error('模板不存在');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            }
                            if (resp.code === 'TEMPLATE_HAS_DEVICE_INSTANCE') {
                                Message.error('模板存在设备实例,不能删除');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else {
                                when_unknow_err(resp.code);
                            }
                        });
                },
            }),

            update: new ElDialog('修改模板', {
                reset_data() {
                    this.data = {
                        counter: 0,
                        data_type_list: [],
                        new_template_name: '',
                        template_id: undefined,
                        remove_entry_id_list: '',
                        new_entry_list: [],
                        remove_entry_list: [],
                        required_field_list: [],
                        update_entry_list: [],
                    };
                },
                enable_commit() {
                    for (const entry of this.data.update_entry_list) {
                        if (entry.name == undefined || entry.name === '') {
                            return false;
                        }
                    }

                    for (const entry of this.data.new_entry_list) {
                        if (entry.name == undefined || entry.name === '') {
                            return false;
                        }
                    }
                    return true;
                },
                before_open(data) {
                    this.data.new_template_name = data.name;
                    this.data.template_id = data.id;

                    get_device_template_required_field_list(get_token())
                        .then((resp) => {
                            let required_field_list =
                                resp.data.deviceTemplateRequiredFieldList;
                            for (
                                let i = 0;
                                i < required_field_list.length;
                                i++
                            ) {
                                const required_field = required_field_list[i];
                                let count = this.data.counter++;
                                required_field.count = count;
                                required_field.must_answer =
                                    required_field.mustAnswer === 1
                                        ? true
                                        : false;
                                required_field.data_type_id =
                                    required_field.dataTypeId;
                            }
                            this.data.required_field_list = required_field_list;
                            return get_device_template_data_type_list(
                                get_token(),
                            );
                        })
                        .then((resp) => {
                            this.data.data_type_list = resp.data.dataTypeList;
                            var params = {
                                template_id_list: data.id,
                            };
                            return get_device_template_list(
                                params,
                                get_token(),
                            );
                        })
                        .then((resp) => {
                            var entry_list =
                                resp.data.deviceTemplateList[0]
                                    .deviceTemplateEntryList;
                            entry_list = entry_list
                                .map((entry) => {
                                    this.data.counter++;
                                    let result_entry = {
                                        count: this.data.counter,
                                        id: entry.id,
                                        name: entry.name,
                                        must_answer:
                                            entry.mustAnswer == 1
                                                ? true
                                                : false,
                                        data_type_id: entry.dataTypeId,
                                    };

                                    return result_entry;
                                })
                                .filter((entry) => {
                                    let entry_name = entry.name;
                                    let required_field_list =
                                        this.data.required_field_list;
                                    if (
                                        required_field_list != undefined &&
                                        required_field_list.length !== 0
                                    ) {
                                        let idx = required_field_list.findIndex(
                                            (elem) => elem.name === entry_name,
                                        );
                                        if (idx !== -1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                });
                            this.data.update_entry_list = entry_list;
                            // let required_field_list =
                            //     this.data.required_field_list;

                            return get_idem();
                        })
                        .then((idem) => {
                            vue.idem_token = idem;
                            this.do_open();
                        });

                    // get_device_template_list(params, get_token())
                    //     .then((resp) => {
                    //         var entry_list =
                    //             resp.data.deviceTemplateList[0]
                    //                 .deviceTemplateEntryList;
                    //         entry_list = entry_list
                    //             .map((entry) => {
                    //                 this.data.counter++;
                    //                 let result_entry = {
                    //                     count: this.data.counter,
                    //                     id: entry.id,
                    //                     name: entry.name,
                    //                     must_answer:
                    //                         entry.mustAnswer == 1
                    //                             ? true
                    //                             : false,
                    //                     data_type_id: entry.dataTypeId,
                    //                 };

                    //                 return result_entry;
                    //             })
                    //             .filter((entry) => {});
                    //         this.data.update_entry_list = entry_list;

                    //         return get_device_template_required_field_list(
                    //             get_token(),
                    //         );
                    //     })
                    //     .then((resp) => {
                    //         let required_field_list =
                    //             resp.data.deviceTemplateRequiredFieldList;
                    //         for (
                    //             let i = 0;
                    //             i < required_field_list.length;
                    //             i++
                    //         ) {
                    //             const required_field = required_field_list[i];
                    //             let count = this.data.counter++;
                    //             required_field.count = count;
                    //             required_field.must_answer =
                    //                 required_field.mustAnswer === 1
                    //                     ? true
                    //                     : false;
                    //             required_field.data_type_id =
                    //                 required_field.dataTypeId;
                    //         }
                    //         this.data.required_field_list = required_field_list;
                    //         return get_device_template_data_type_list(
                    //             get_token(),
                    //         );
                    //     })
                    //     .then((resp) => {
                    //         this.data.data_type_list = resp.data.dataTypeList;
                    //         return get_idem();
                    //     })
                    //     .then((idem) => {
                    //         vue.idem_token = idem;
                    //         this.do_open();
                    //     });
                },

                // new_entry_list: [],
                //         remove_entry_list: [],
                //         update_entry_list: [
                //             {
                //                 count: 1,
                //                 data_type_id: 1,
                //                 must_answer: false,
                //                 name: '',
                //             },
                //         ],
                do_commit() {
                    let update_entry_list = cloneDeep(
                        this.data.update_entry_list,
                    );
                    update_entry_list = update_entry_list.map((entry) => {
                        return {
                            name: entry.name,
                            mustAnswer: entry.must_answer == true ? 1 : 0,
                            id: entry.id,
                            dataTypeId: entry.data_type_id,
                        };
                    });

                    let remove_entry_list = cloneDeep(
                        this.data.remove_entry_list,
                    );
                    remove_entry_list = remove_entry_list.map((entry) => {
                        return {
                            id: entry.id,
                        };
                    });

                    let new_entry_list = cloneDeep(this.data.new_entry_list);
                    new_entry_list = new_entry_list.map((entry) => {
                        return {
                            name: entry.name,
                            mustAnswer: entry.must_answer == true ? 1 : 0,
                            dataTypeId: entry.data_type_id,
                        };
                    });

                    let data = {
                        name: this.data.new_template_name,
                        newEntryList: new_entry_list,
                        removeEntryList: remove_entry_list,
                        updateEntryList: update_entry_list,
                    };

                    let template_id = this.data.template_id;

                    update_device_template(
                        template_id,
                        data,
                        get_token(),
                        vue.idem_token,
                    )
                        .then((resp) => {
                            Message.success('修改成功');
                            vue.table.fetch_data();
                            this.close();
                        })
                        .catch((resp) => {
                            if (resp.code === 'NO_DEVICE_TEMPLATE') {
                                Message.warning('设备模板不存在');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else if (resp.code === 'NO_ENTRY_DATA_TYPE') {
                                Message.warning('字段类型不存在');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else if (
                                resp.code ===
                                'UPDATE_DATA_TYPE_ID_OF_ENTRY_NOT_SUPPORT'
                            ) {
                                Message.warning('不支持修改模板字段类型');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else if (
                                resp.code ===
                                'CAN_NOT_MODIFY_TEMPLATE_REQUIRED_ENTRY'
                            ) {
                                Message.warning('不能修改设备模板必须字段');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else if (
                                resp.code === 'TEMPLATE_ENTRY_NAME_DUPLICATE'
                            ) {
                                Message.warning('字段名重复');
                                get_idem().then((idem) => {
                                    vue.idem_token = idem;
                                });
                            } else {
                                when_unknow_err(resp.code);
                            }
                        });
                },
            }),

            info: new ElDialog('模板详情', {
                table: new ElTable('模板属性列表', {
                    cols: [
                        {
                            prop: 'id',
                            label: '属性id',
                        },
                        {
                            prop: 'name',
                            label: '属性名',
                        },
                        {
                            prop: 'data_type_name',
                            label: '属性类型',
                        },
                        {
                            prop: 'must_answer',
                            label: '是否必填',
                        },
                    ],
                    do_fetch_data() {
                        let data_type_list = vue.info.data.data_type_list;
                        let entry_list = vue.info.data.entry_list;

                        let data_type_map = {};
                        for (let i = 0; i < data_type_list.length; i++) {
                            let data_type = data_type_list[i];
                            data_type_map[data_type.id] = data_type;
                        }
                        for (let i = 0; i < entry_list.length; i++) {
                            let entry = entry_list[i];
                            let data_type_id = entry.data_type_id;
                            let data_type = data_type_map[data_type_id];
                            entry.data_type_name = data_type.name;
                        }
                        this.data = entry_list;
                    },
                }),
                reset_data() {
                    this.data = {
                        counter: 0,
                        template_name: '',
                        template_id: undefined,
                        data_type_list: [],
                        entry_list: [
                            {
                                count: 1,
                                data_type_id: 1,
                                must_answer: false,
                                name: '',
                                id: undefined,
                            },
                        ],
                    };
                },
                before_open(data) {
                    this.data.template_name = data.name;
                    this.data.template_id = data.id;
                    var params = {
                        template_id_list: data.id,
                    };
                    get_device_template_list(params, get_token())
                        .then((resp) => {
                            var entry_list =
                                resp.data.deviceTemplateList[0]
                                    .deviceTemplateEntryList;
                            entry_list = entry_list.map((entry) => {
                                this.data.counter++;

                                return {
                                    count: this.data.counter,
                                    id: entry.id,
                                    name: entry.name,
                                    must_answer:
                                        entry.mustAnswer == 1 ? true : false,
                                    data_type_id: entry.dataTypeId,
                                };
                            });
                            this.data.entry_list = entry_list;
                            return get_device_template_data_type_list(
                                get_token(),
                            );
                        })
                        .then((resp) => {
                            this.data.data_type_list = resp.data.dataTypeList;
                            this.table.fetch_data();
                            return get_idem();
                        })
                        .then((idem) => {
                            vue.idem_token = idem;
                            this.do_open();
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
        add_one_new_entry() {
            this.insert.data.entry_list.push({
                count: ++this.insert.data.entry_counter,
                name: '',
                data_type_id: 1,
                must_answer: false,
            });
        },

        update_add_one_new_entry() {
            this.update.data.new_entry_list.push({
                count: ++this.update.data.counter,
                name: '',
                data_type_id: 1,
                must_answer: false,
            });
        },
        update_delete_entry(entry, type) {
            if (type == 'remove_old') {
                let entry_list = this.update.data.update_entry_list;
                let remove_idx = entry_list.findIndex((elem) => {
                    return elem.count == entry.count;
                });
                let remove_entry = entry_list[remove_idx];
                entry_list.splice(remove_idx, 1);

                let remove_entry_list = this.update.data.remove_entry_list;
                remove_entry.count = ++this.update.data.counter;
                remove_entry_list.push(remove_entry);
            } else if (type == 'remove_new') {
                let entry_list = this.update.data.new_entry_list;
                let remove_idx = entry_list.findIndex((elem) => {
                    return elem.count == entry.count;
                });
                entry_list.splice(remove_idx, 1);
            }
        },

        insert_delete_entry(entry) {
            let entry_list = this.insert.data.entry_list;
            let remove_idx = entry_list.findIndex((elem) => {
                return elem.count == entry.count;
            });
            entry_list.splice(remove_idx, 1);
        },
    },
};
</script>

<style lang="scss">
@import '~@/styles/common-style.scss';
</style>
