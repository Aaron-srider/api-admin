<!--  -->
<template>
    <div class="">
        <div>
            <el-tree
                ref="tree"
                :expand-on-click-node="false"
                :props="props"
                :load="loadNode"
                lazy
                node-key="id"
                :render-content="render_tree_content"
                @check-change="handleCheckChange"
            ></el-tree>
        </div>
    </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { get_sub_ou } from '@/api/dept.js';
import { get_totp_whitelist } from '@/api/totp.js';
import { update_totp_whitelist } from '@/api/totp_whitelist.js';
import { set_map } from '@/utils';
export default {
    // import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        // 这里存放数据
        return {
            node_cache: new Map(),
            /**
             * 缓存选中的person的samAccountName
             */
            person_selected: [],
            props: {
                label: 'name',
                children: 'children',
                isLeaf: 'is_leaf',
            },
            count: 1,
            test: 2,
        };
    },

    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {},
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
        getCheckedKeys() {
            hello();
        },
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
        },
        handleNodeClick(data) {
            console.log(data);
        },
        loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve([
                    {
                        id: 'root',
                        is_leaf: false,
                        name: 'root',
                        type: 'root',
                        disabled: true,
                    },
                    // { name: "region2" },
                ]);
            }

            var employees = '';

            get_sub_ou(node.data.id)
                .then((resp) => {
                    console.log(resp);
                    var resolve_list = [];

                    var sub_employee_list = resp.data.subEmployeeList;
                    var sub_ou_list = resp.data.subOUList;

                    for (var employee of sub_employee_list) {
                        resolve_list.push({
                            id: employee.samAccountName,
                            is_leaf: true,
                            name: employee.cn,
                            type: 'person',
                        });
                        employees += employee.samAccountName;
                        employees += ',';
                    }
                    if (employees.length > 0) {
                        employees = employees.substring(
                            0,
                            employees.length - 1,
                        );
                    }

                    for (var ou of sub_ou_list) {
                        resolve_list.push({
                            id: ou.name,
                            is_leaf: ou.isLeaf,
                            type: 'group',
                            disabled: true,
                            name: ou.name,
                        });
                    }

                    return resolve_list;
                })
                .then((resolve_list) => {
                    get_totp_whitelist(employees).then((resp) => {
                        if (resp.data.accessList.length == 0) {
                            resolve(resolve_list);
                        } else {
                            var access_list = resp.data.accessList;
                            for (var access_item of access_list) {
                                if (
                                    access_item.canAccessTotp != undefined &&
                                    (access_item.canAccessTotp == 1 ||
                                        access_item.canAccessTotp == 0)
                                ) {
                                    set_map(
                                        this.node_cache,
                                        access_item.samAccountName,
                                        access_item.canAccessTotp,
                                        this,
                                    );
                                }
                            }

                            resolve(resolve_list);
                            this.$nextTick(function() {
                                this.render_permit_icon();
                            });
                        }
                    });
                });
        },
        render_tree_content(h, { node, data, store }) {
            if (node.data.type == 'group') {
                return (
                    <div class='flex'>
                        <div class='mgr8'>
                            <svg
                                t='1658583027531'
                                style='width:25px;height:25px; position: relative; '
                                viewBox='0 0 1024 1024'
                                version='1.1'
                                xmlns='http://www.w3.org/2000/svg'
                                p-id='1275'
                            >
                                <path
                                    d='M686 595.1c-19.8-17.6-42.3-31.8-66.6-42.4 41.2-32.4 67.8-82.6 67.8-139 0-97.4-79.2-176.6-176.6-176.6-97.4 0-176.6 79.2-176.6 176.6 0 56.4 26.5 106.6 67.8 139-24.3 10.6-46.8 24.9-66.6 42.4-48 42.7-74.5 99.7-74.5 160.6 0 16.6 13.4 30 30 30s30-13.4 30-30c0-91.2 85.2-165.5 189.9-165.5s189.9 74.2 189.9 165.5c0 16.6 13.4 30 30 30s30-13.4 30-30c-0.1-60.8-26.5-117.9-74.5-160.6zM394 413.7c0-64.3 52.3-116.6 116.6-116.6s116.6 52.3 116.6 116.6-52.3 116.6-116.6 116.6S394 478 394 413.7z'
                                    fill='#595BB3'
                                    p-id='1276'
                                ></path>
                                <path
                                    d='M321.9 589.6c0-16.6-13.4-30-30-30-52.2 0-94.6-42.4-94.6-94.6 0-52.2 42.4-94.6 94.6-94.6 16.6 0 30-13.4 30-30s-13.4-30-30-30c-85.2 0-154.6 69.4-154.6 154.6 0 46.7 20.8 88.6 53.7 117-18.6 8.8-35.8 20.2-51.2 33.8C98 653 75 702.7 75 755.8c0 16.6 13.4 30 30 30s30-13.4 30-30c0-75.1 70.4-136.1 156.9-136.1 16.6-0.1 30-13.5 30-30.1zM883.8 615.9c-15.4-13.7-32.6-25-51.2-33.8 32.8-28.4 53.7-70.3 53.7-117 0-85.2-69.4-154.6-154.6-154.6-16.6 0-30 13.4-30 30s13.4 30 30 30c52.2 0 94.6 42.4 94.6 94.6 0 52.2-42.4 94.6-94.6 94.6-16.6 0-30 13.4-30 30s13.4 30 30 30c86.5 0 156.9 61.1 156.9 136.1 0 16.6 13.4 30 30 30s30-13.4 30-30c0-53.1-23-102.8-64.8-139.9z'
                                    fill='#595BB3'
                                    p-id='1277'
                                ></path>
                            </svg>
                        </div>
                        <div class='flex align-center justify-end'>
                            <div class='mgr8'>
                                <span class='fs16'>{node.data.name}</span>
                            </div>
                        </div>
                    </div>
                );
            } else if (node.data.type == 'person') {
                return (
                    <div class='flex'>
                        <div class='mgr8'>
                            <svg
                                style='width:25px;height:25px; position: relative; '
                                t='1658584214686'
                                class='icon'
                                viewBox='0 0 1024 1024'
                                version='1.1'
                                xmlns='http://www.w3.org/2000/svg'
                                p-id='1417'
                            >
                                <path
                                    d='M511.3 158.2c38.6 0 74.8 15 102.1 42.3s42.3 63.5 42.3 102.1-15 74.8-42.3 102.1C586.1 432 549.9 447 511.3 447s-74.8-15-102.1-42.3C382 377.3 367 341 367 302.5s15-74.8 42.3-102.1c27.2-27.2 63.5-42.2 102-42.2m0-60C398.5 98.2 307 189.6 307 302.5c0 112.8 91.5 204.3 204.3 204.3 112.8 0 204.3-91.5 204.3-204.3 0.1-112.9-91.4-204.3-204.3-204.3zM511.3 605.1c54.3 0 102.4 6.1 143.1 18.1 34.8 10.3 65.1 25.3 89.9 44.5 21.9 17 39.9 37.2 55.1 61.8 13.5 22 24.4 47 33.2 76.3 5.6 18.5-2.2 32.8-7.4 39.7-10.7 14.4-27.9 22.6-47.3 22.6H244.8c-19.3 0-36.6-8.2-47.3-22.6-5.1-6.9-12.9-21.2-7.4-39.7 8.8-29.3 19.6-54.3 33.2-76.3 15.1-24.6 33.1-44.9 55.1-61.8 24.8-19.2 55.1-34.2 89.9-44.5 40.6-12 88.8-18.1 143-18.1m0-60c-251.6 0-341.4 119.3-378.6 243.5-21 70 34.8 139.6 112.1 139.6h533.1c77.3 0 133.1-69.6 112.1-139.6-37.3-124.2-127.1-243.5-378.7-243.5z'
                                    fill='#595BB3'
                                    p-id='1418'
                                ></path>
                            </svg>
                        </div>
                        <div class='flex flex-center'>
                            <div>
                                <span class='fs16'>{node.data.name}</span>
                            </div>
                            <div style='position: absolute; right:200px'>
                                <span class='mgr8'>
                                    <span
                                        style='display:none;'
                                        name='permit-icon-id'
                                    >
                                        {node.data.id}
                                    </span>
                                    <i
                                        style='color:red;'
                                        class='el-icon-close'
                                    ></i>
                                </span>
                                <span
                                    class='underline'
                                    on-click={() =>
                                        this.change_permit([data.id], 1)
                                    }
                                >
                                    允许
                                </span>
                                <span class=''> </span>
                                <span
                                    class='underline'
                                    on-click={() =>
                                        this.change_permit([data.id], 0)
                                    }
                                >
                                    拒绝
                                </span>
                            </div>
                        </div>
                    </div>
                );
            } else if (node.data.type == 'root') {
                return (
                    <div class='flex'>
                        <div class='mgr8'>
                            <svg
                                style='width:25px;height:25px; position: relative; '
                                t='1658585053601'
                                class='icon'
                                viewBox='0 0 1024 1024'
                                version='1.1'
                                xmlns='http://www.w3.org/2000/svg'
                                p-id='1703'
                            >
                                <path
                                    d='M511.1 538.3c-4.8 0-9.6-1.1-14.1-3.3L85.5 329.2c-10.6-5.3-17.4-16.2-17.4-28.1s6.7-22.8 17.4-28.1L497.1 67.2c8.8-4.4 19.3-4.4 28.1 0L936.8 273c10.6 5.3 17.4 16.2 17.4 28.1s-6.7 22.8-17.4 28.1L525.2 535c-4.5 2.2-9.3 3.3-14.1 3.3zM169.8 301.1l341.3 170.6 341.3-170.6-341.3-170.7-341.3 170.7z'
                                    fill='#595BB3'
                                    p-id='1704'
                                ></path>
                                <path
                                    d='M511.1 758.1c-4.8 0-9.6-1.1-14.1-3.3L85.5 549c-15.5-7.8-21.8-26.6-14.1-42.2 7.8-15.5 26.6-21.8 42.2-14.1l397.5 198.8 397.5-198.8c15.5-7.8 34.4-1.5 42.2 14.1 7.8 15.5 1.5 34.4-14.1 42.2L525.2 754.7c-4.5 2.2-9.3 3.4-14.1 3.4z'
                                    fill='#595BB3'
                                    p-id='1705'
                                ></path>
                                <path
                                    d='M511.1 960.2c-4.8 0-9.6-1.1-14.1-3.3L85.5 751.1c-15.5-7.8-21.8-26.6-14.1-42.2 7.8-15.5 26.6-21.8 42.2-14.1l397.5 198.8 397.5-198.8c15.5-7.8 34.4-1.5 42.2 14.1 7.8 15.5 1.5 34.4-14.1 42.2L525.2 956.9c-4.5 2.2-9.3 3.3-14.1 3.3z'
                                    fill='#595BB3'
                                    p-id='1706'
                                ></path>
                            </svg>
                        </div>
                    </div>
                );
            }
        },

        change_permit(sam_account_name_list, op) {
            var data = {
                userSamAccountNameList: sam_account_name_list,
                op: op,
            };
            update_totp_whitelist(data).then((resp) => {
                if (resp.code == 'SUCCESS') {
                    this.$message({
                        type: 'success',
                        message: '操作成功',
                    });
                    for (var item of resp.data) {
                        if (
                            item.update != undefined &&
                            item.update == 'success'
                        ) {
                            set_map(
                                this.node_cache,
                                item.samAccountName,
                                op,
                                this,
                            );
                            this.render_permit_icon();
                        }
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: '错误代码：' + resp.code,
                    });
                }
            });
        },
        render_permit_icon() {
            var $permit_icon_id_elem = $(`[name=permit-icon-id]`);
            for (var elem of $permit_icon_id_elem) {
                var $this = $(elem);
                var id = $this.text();
                var permit = this.node_cache.get(id);
                console.log(id + ' ' + permit);
                if (permit != undefined && permit == 1) {
                    console.log('change to check');
                    $this
                        .next()
                        .attr('class', 'el-icon-check')
                        .attr('style', 'color:green');
                }

                if (permit != undefined && permit == 0) {
                    console.log('change to close');
                    $this
                        .next()
                        .attr('class', 'el-icon-close')
                        .attr('style', 'color:red');
                }
            }
        },
    },
};
</script>
<style lang="scss">
@import '~@/styles/common-style.scss';
</style>
<style lang="css" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

/deep/ .el-tree-node__content {
    margin: 0 0 10px 0;
}
</style>
