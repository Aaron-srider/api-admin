<template>
    <div>
        <page-header :title="page_title"></page-header>

        <div class="" style="width: 95%; margin: 0 auto">
            <div class="mgb20" style="width: 100%">
                <div class="flex">
                    <el-autocomplete
                        v-model="query_string"
                        style="width: 100%; border-radius: 50px"
                        class="inline-input"
                        :fetch-suggestions="query_search"
                        placeholder="请输入设备序列号"
                        :trigger-on-focus="false"
                        @select="handle_select"
                    ></el-autocomplete>

                    <el-button
                        id="totp-search-btn"
                        type="primary"
                        icon="el-icon-search"
                        @click="handle_select"
                    >
                        搜索
                    </el-button>
                </div>
            </div>

            <div v-show="show_not_found">
                <i class="el-icon-warning-outline mgr8"></i>
                找不到与您的搜索匹配的设备
            </div>
            <!-- 设备信息 -->
            <div v-show="result_present == true" ref="device-info">
                <div class="flex">
                    <div class="mgr20">
                        Totp：
                        <span
                            class="el-font-family fs20 lt-blue"
                            style="text-align: center"
                        >
                            {{ totp }}
                        </span>
                    </div>

                    <div ref="totp-timeout" style="width: 20%">
                        <el-progress
                            :percentage="timeout_percent"
                            :format="format"
                        ></el-progress>
                    </div>
                </div>
            </div>

            <div>
                <my-el-table :el_table="table">
                    <template slot-scope="scope">
                        <div
                            v-if="
                                scope.col.prop == 'content' &&
                                scope.row['dataTypeName'] == '设备预共享秘钥'
                            "
                        >
                            <div class="flex">
                                <div class="flexg5">
                                    <div class="mgr10">
                                        Totp：
                                        <span
                                            class="el-font-family fs20 lt-blue"
                                            style="text-align: center"
                                        >
                                            {{ totp }}
                                        </span>
                                    </div>
                                </div>

                                <div class="flexg5" ref="totp-timeout">
                                    <el-progress
                                        style="line-height: 1.7; width: 100%"
                                        :percentage="timeout_percent"
                                        :format="format"
                                    ></el-progress>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            {{ scope.row[scope.col.prop] }}
                        </div>
                    </template>
                </my-el-table>
            </div>
        </div>
    </div>
</template>

<script>
import pageHeader from '@/views/common/page-header.vue';
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { get_totp, poll_totp } from '@/api/totp';
import { get_token } from '@/utils/auth';
import { get_devices, get_full_device_serial_number } from '@/api/device';
import { when_unknow_err } from '@/utils';
import MyElTable from '@/views/oop_components/MyElTable.vue';
import { ElDialog, ElTable, MyElCompletion } from '@/lib/index';
import { Message } from 'element-ui';
var vue;
var timer;

class RespData {
    fetch_from_resp(resp) {}
}

class DeviceInfo extends RespData {
    constructor(deviceInfoId, deviceName) {
        super();
        this.id = deviceInfoId;
        this.name = deviceName;
        this.deviceInfoEntryList = [];
    }

    fetch_from_resp(resp) {
        if (resp == undefined) {
            return;
        }
        this.id = resp.id;
        this.name = resp.name;
        this.device_serial_number = resp.deviceSerialNumber;
        for (var deviceInfoEntryResp of resp.deviceInfoEntryList) {
            var deviceInfoEntry = new TemplateEntry();
            deviceInfoEntry.fetch_from_resp(deviceInfoEntryResp);
            this.deviceInfoEntryList.push(deviceInfoEntry);
        }
    }
}

class TemplateEntry extends RespData {
    constructor() {
        super();
        this.content = '';
        this.name = '';
        this.dataTypeId = null;
        this.dataTypeName = '';
    }

    fetch_from_resp(resp) {
        if (resp == undefined) {
            return;
        }
        this.content = resp.content;
        if (resp.templateEntry != undefined) {
            this.name = resp.templateEntry.name;
            this.mustAnswer = resp.templateEntry.mustAnswer;

            if (resp.templateEntry.dataType == undefined) {
                return;
            }
            this.dataTypeId = resp.templateEntry.dataType.id;
            this.dataTypeName = resp.templateEntry.dataType.name;
        }
    }
}

var deviceList = [
    {
        id: 12,
        name: 'default-device-name-094484a6c79547ca842c21c222bfac30',
        deviceSerialNumber: null,
        deviceTemplate: {
            name: '通用设备模板',
            serialNumber: '2226409e-d1e2-44cf-a6f9-e89a416ac1a5',
            deviceTemplateList: null,
        },
        deviceInfoEntryList: [
            {
                content: 'h90apsd8hgaph89rfas93grf',
                templateEntry: {
                    name: '设备序列号',
                    mustAnswer: 1,
                    dataTypeId: 1,
                    dataType: {
                        id: 1,
                        name: 'String',
                    },
                },
            },
            {
                content: '北京节点',
                templateEntry: {
                    name: '设备名称',
                    mustAnswer: 0,
                    dataTypeId: 1,
                    dataType: {
                        id: 1,
                        name: 'String',
                    },
                },
            },
        ],
    },
    {
        id: 12,
        name: 'default-device-name-094484a6c79547ca842c21c222bfac30',
        deviceSerialNumber: null,
        deviceTemplate: {
            name: '通用设备模板',
            serialNumber: '2226409e-d1e2-44cf-a6f9-e89a416ac1a5',
            deviceTemplateList: null,
        },
        deviceInfoEntryList: [
            {
                content: 'h90apsd8hgaph89rfas93grf',
                templateEntry: {
                    name: '设备序列号',
                    mustAnswer: 1,
                    dataTypeId: 1,
                    dataType: {
                        id: 1,
                        name: 'String',
                    },
                },
            },
            {
                content: '北京节点',
                templateEntry: {
                    name: '设备名称',
                    mustAnswer: 0,
                    dataTypeId: 1,
                    dataType: {
                        id: 1,
                        name: 'String',
                    },
                },
            },
        ],
    },
];

function initDeviceInfoListFromResp(resp) {
    let deviceList = resp.data.deviceList;
    let list = [];
    if (deviceList == undefined) {
        return list;
    }
    for (var deviceInfoResp of deviceList) {
        var deviceInfo = new DeviceInfo();
        deviceInfo.fetch_from_resp(deviceInfoResp);
        list.push(deviceInfo);
    }
    return list;
}

export default {
    // import引入的组件需要注入到对象中才能使用
    components: { pageHeader, MyElTable },
    data() {
        // 这里存放数据
        return {
            table: new ElTable('权限表格', {
                cols: [
                    {
                        prop: 'name',
                        label: '属性名称',
                    },
                    {
                        prop: 'dataTypeName',
                        label: '属性类型',
                    },
                    {
                        prop: 'content',
                        label: '属性值',
                    },
                ],

                do_fetch_data(data) {
                    // 清理之前的计时器
                    if (timer != undefined) {
                        clearInterval(timer);
                    }
                    var req_data = { deviceSerialNumberList: vue.query_string };
                    get_devices(req_data, get_token()).then((resp) => {
                        var device_list = initDeviceInfoListFromResp(resp);
                        var device;
                        if (device_list.length !== 0) {
                            device = device_list[0];
                            var entry_list = device.deviceInfoEntryList;
                            this.data = entry_list;
                        } else {
                            this.data = [];
                        }

                        if (this.data.length === 0) {
                            return;
                        }

                        let serialnum_idx = this.data.findIndex(
                            (elem) => elem.name === '设备序列号',
                        );
                        let serialnum_entry = this.data[serialnum_idx];
                        let serialnum = undefined;
                        if (serialnum_entry != undefined) {
                            serialnum = serialnum_entry.content;
                        }

                        let has_psk = false;

                        for (var entry of this.data) {
                            var dataTypeName = entry.dataTypeName;
                            if (
                                dataTypeName != undefined &&
                                dataTypeName == '设备预共享秘钥'
                            ) {
                                has_psk = true;
                                // 清理之前的计时器
                                if (timer != undefined) {
                                    clearInterval(timer);
                                }
                                // 启动定时器，每隔一秒拉去totp
                                timer = setInterval(() => {
                                    console.log('启动定时器，每隔一秒拉去totp');
                                    let params = {
                                        deviceSerialNumber: serialnum,
                                    };
                                    poll_totp(params, get_token())
                                        .then((resp) => {
                                            var code = resp.code;
                                            if (code == 'SUCCESS') {
                                                $(
                                                    vue.$refs['totp-timeout'],
                                                ).removeClass('hide');
                                                vue.totp = vue.display_totp(
                                                    resp.data.totp,
                                                );
                                                vue.timeout_percent =
                                                    resp.data.totpTimeout;
                                            } else if (
                                                code == 'USER_NOT_PERMIT_TOTP'
                                            ) {
                                                // 无权访问totp，取消计时器，防止不停发消息
                                                clearInterval(timer);
                                                vue.totp = '您无权访问Totp';
                                                console.log(
                                                    $(
                                                        vue.$refs[
                                                            'totp-timeout'
                                                        ],
                                                    ),
                                                );
                                                $(
                                                    vue.$refs['totp-timeout'],
                                                ).addClass('hide');
                                            }
                                        })
                                        .catch((resp) => {
                                            // 清理之前的计时器
                                            if (timer != undefined) {
                                                clearInterval(timer);
                                            }
                                        });
                                }, 1000);
                            }
                        }

                        if (has_psk === false) {
                            Message.warning('该设备没有TOTP码');
                            return;
                        }
                    });
                },
            }),
            page_title: '设备 TOTP',

            show_not_found: false,
            result_present: false,
            totp: 'xxx xxx',
            timeout_percent: 0,
            device_info: {},
            query_string: '',
            col_count: 4,
            loading_map: new Map(),
            totp_map: new Map(),
            display_totp_lock: new Map(),
            device_list: [
                {
                    name: 'device1',
                    device_serial_number: '8970924377523045',
                },
            ],
        };
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {
        vue = this;

        this.table.do_fetch_data();
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
    // 生命周期 - 创建之前
    beforeCreate() {},
    // 生命周期 - 挂载之前
    beforeMount() {},
    // 生命周期 - 更新之前
    beforeUpdate() {},
    // 生命周期 - 更新之后
    updated() {},
    // 生命周期 - 销毁之前
    beforeDestroy() {},
    // 生命周期 - 销毁完成
    destroyed() {},
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated() {},
    // 方法集合
    methods: {
        format() {
            return '';
        },
        handle_select() {
            // 清理之前的计时器
            if (timer != undefined) {
                clearInterval(timer);
            }

            this.table.do_fetch_data();

            // // 首先获取设备信息
            // get_devices(req_data, get_token())
            //     .then((resp) => {
            //         if (
            //             resp.data.deviceList != undefined &&
            //             resp.data.deviceList.length != 0
            //         ) {
            //             var device_info_list = initDeviceInfoListFromResp(resp);

            //             var device_info = device_info_list[0];
            //             var entry_list = device_info.deviceInfoEntryList;
            //             console.log('设备信息：', device_info);

            //             var table_data = entry_list;
            //             this.table.data = table_data;

            //             this.show_not_found = false;
            //             this.result_present = true;
            //             // this.device_info = resp.data.deviceList[0];

            //             // 启动定时器，每隔一秒拉去totp
            //             timer = setInterval(function () {
            //                 console.log('启动定时器，每隔一秒拉去totp');
            //                 var serial_num = vue.query_string;
            //                 get_totp(serial_num, get_token()).then((resp) => {
            //                     var code = resp.code;
            //                     if (code == 'SUCCESS') {
            //                         $(vue.$refs['totp-timeout']).removeClass(
            //                             'hide',
            //                         );
            //                         vue.totp = vue.display_totp(resp.data.totp);
            //                         vue.timeout_percent = resp.data.totpTimeout;
            //                     } else if (code == 'USER_NOT_PERMIT_TOTP') {
            //                         // 无权访问totp，取消计时器，防止不停发消息
            //                         clearInterval(timer);
            //                         vue.totp = '您无权访问Totp';
            //                         console.log($(vue.$refs['totp-timeout']));
            //                         $(vue.$refs['totp-timeout']).addClass(
            //                             'hide',
            //                         );
            //                     }
            //                 });
            //             }, 1000);
            //         } else {
            //             this.result_present = false;
            //             this.show_not_found = true;
            //         }
            //     })
            //     .catch((resp) => when_unknow_err(resp.code));
        },
        query_search(query_string, cb) {
            get_full_device_serial_number(query_string, get_token())
                .then((resp) => cb(resp.data.fullSerialNumberList))
                .catch((resp) => when_unknow_err(resp.code));
        },

        get_device_row_list() {
            var device_row_list = [];
            var count = 0;
            for (var device of this.device_list) {
                if (count++ % this.col_count == 0) {
                    var new_row = [];
                    new_row.push(device);
                    device_row_list.push(new_row);
                } else {
                    device_row_list.at(device_row_list.length - 1).push(device);
                }
            }
            console.log(device_row_list);
            return device_row_list;
        },
        reveal_totp(device_serial_number) {
            console.log(device_serial_number);
            var $prompt = $(this.$refs[`totp_prompt_${device_serial_number}`]);
            var $totp = $(this.$refs[`totp_${device_serial_number}`]);

            this.loading_map.set(device_serial_number, true);
            this.$forceUpdate();
            get_totp(device_serial_number, get_token()).then((resp) => {
                var code = resp.code;
                if (code == 'SUCCESS') {
                    if (
                        this.display_totp_lock.get(device_serial_number) ==
                        false
                    ) {
                        $totp.removeClass('hide');
                        $prompt.addClass('hide');

                        setTimeout(() => {
                            this.display_totp_lock.set(
                                device_serial_number,
                                false,
                            );
                            this.$forceUpdate();

                            $prompt.removeClass('hide');
                            $totp.addClass('hide');
                        }, 5000);
                        this.display_totp_lock.set(device_serial_number, true);
                        this.$forceUpdate();
                    }

                    this.totp_map.set(device_serial_number, resp.data.totp);
                    this.loading_map.set(device_serial_number, false);
                    this.$forceUpdate();
                } else if (code == 'USER_NOT_PERMIT_TOTP') {
                    this.loading_map.set(device_serial_number, false);
                    this.$forceUpdate();
                    this.$message({
                        type: 'warning',
                        message: '您没有权限访问totp',
                    });
                }
            });
        },
        display_totp(totp) {
            var first = totp.substring(0, 3);
            var second = totp.substring(3, 6);
            return first + ' ' + second;
        },
    },
    beforeRouteLeave: function (to, from, next) {
        if (timer != undefined) {
            clearInterval(timer);
        }
        next();
    },
};
</script>
<style lang="scss">
@import '~@/styles/common-style.scss';
</style>
<style lang="css" scoped>
.card {
    width: 20%;
    height: 150px;
    margin: 0 auto;
    margin-bottom: 30px;
}
/deep/ .el-input__inner {
    border-radius: 50px;
    background-color: #eeeeee;
    border: 0;
}

#totp-search-btn {
    background-color: #eeeeee;
    color: black;
    border: 0;
    margin-left: 10px;
}
#totp-search-btn:hover {
    background-color: #f5f5f5;
}

#totp-search-btn:active {
    background-color: #eeeeee;
}
</style>
