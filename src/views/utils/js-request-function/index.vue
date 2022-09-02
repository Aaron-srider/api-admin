<template>
    <div style="width: 95%; margin: 20px auto 0 auto">
        <!-- 搜索栏目 -->
        <div class="bc-b-gray mgb8">
            <div class="flex" style="width: 50%">
                <el-button
                    id="search"
                    class="el-icon-search fs20 mgr20 mgb8 br15"
                    style=""
                    size="small"
                    @click="click_search"
                ></el-button>
                <el-select v-model="query_method" placeholder="请选择">
                    <el-option
                        v-for="item in ['GET', 'POST', 'DELETE', 'PUT']"
                        :key="item"
                        :label="item"
                        :value="item"
                    ></el-option>
                </el-select>
                <el-input
                    v-model="query_path"
                    placeholder="根据path模糊搜索"
                    @keyup.enter.native="click_search"
                ></el-input>
            </div>
        </div>
        <div class="flex bc-b-gray" style="height: 60px; line-height: 3">
            <div class="flexg1">ID</div>
            <div class="flexg1">Method</div>
            <div class="flexg3">Path</div>
            <!-- <div class="flexg1">module</div> -->
            <div class="flexg3"><div class="pdl10">Updatetime</div></div>

            <div class="flexg10">Body</div>
            <div class="flexg3">
                <div class="pdl20">Op</div>
            </div>
        </div>
        <div
            v-for="js_req_func in js_func_list"
            :key="js_req_func.id"
            style="min-height: 200px"
            class="flex bc-b-gray pdt10"
        >
            <div class="flexg1">
                {{ js_req_func.id }}
            </div>
            <div class="flexg1">{{ js_req_func.http_method }}</div>

            <div class="flexg3" style="word-break: break-all">
                {{ js_req_func.path }}
            </div>
            <!-- <div class="flexg1">
                {{
                    js_req_func.module == undefined || js_req_func.module == ""
                        ? "无"
                        : js_req_func.module
                }}
            </div> -->

            <div class="flexg3">
                <div class="pdl10">
                    {{ js_req_func.update_time }}
                </div>
            </div>
            <div class="flexg10">
                <v-md-preview
                    :id="`func-body-${js_req_func.id}`"
                    :text="js_req_func.function_string"
                    style="min-height: 100px; max-width: 650px"
                ></v-md-preview>
                <!-- <vue-markdown :breaks="true">
                    {{  }}
                </vue-markdown> -->
            </div>
            <div class="flexg3">
                <div class="pdl20">
                    <el-button
                        icon="el-icon-document-copy"
                        circle
                        @click="copy_click(js_req_func)"
                    ></el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get_js_request_function_list } from '@/api/utils';
import VueMarkdown from 'vue-markdown';
import { Message } from 'element-ui';

export default {
    components: {
    },
    data() {
        return {
            js_func_list: [
                {
                    id: 0,
                    path: '/utils/test',
                    module: 'test',
                    function_string:
                        '\`\`\`js \n' +
                        "export function test_api_method(params) {\n    return request({\n        url:'/api/test/test_api_method',\n        method:'get',\n        params:params,\n    });\n}\n" +
                        '\n \`\`\`',
                    update_time: '2022-07-09 22:44:11',
                },
            ],
            query_path: undefined,
            query_method: 'GET',
        };
    },
    created() {
        this.fetch_data();
    },

    mounted() {
        this.$nextTick(function () {
            var $code1 = $('#md1 code');
            console.log($code1);
            console.log($code1.text());
        });

        // var $childs = $code1.children();
        // console.log($childs);
    },

    methods: {
        copy_click(data) {
            var $code_dom = $(`#func-body-${data.id}`);
            console.log('获取需要复制内容的元素:', $code_dom);
            var func_string = $code_dom.text();
            console.log('获取需要复制的内容:', func_string);

            this.copy_to_clip(func_string);

            Message.success('复制成功');
        },

        copy_to_clip(text) {
            console.log(navigator);
            if (navigator.clipboard) {
                // clipboard api 复制
                navigator.clipboard.writeText(text);
                console.log('use clipboard', text);
            } else {
                console.log('use command', text);

                var textarea = document.createElement('textarea');
                document.body.appendChild(textarea);
                // 隐藏此输入框
                textarea.style.position = 'fixed';
                textarea.style.clip = 'rect(0 0 0 0)';
                textarea.style.top = '10px';
                // 赋值
                textarea.value = text;
                // 选中
                textarea.select();
                // 复制
                document.execCommand('copy');
                // // 移除输入框
                // document.body.removeChild(textarea);
            }
        },
        click_search() {
            this.fetch_data();
        },
        fetch_data() {
            var data = {
                path: this.query_path == '' ? undefined : this.query_path,
                http_method: this.query_method,
            };
            get_js_request_function_list(data).then((resp) => {
                this.js_func_list = [];
                var request_function_list = resp.data.requestFunctionList;
                for (var func of request_function_list) {
                    this.js_func_list.push({
                        id: func.id,
                        path: func.path,
                        http_method: func.httpMethod,
                        module: func.module,
                        function_string:
                            '\`\`\`js \n' + func.functionString + '\n \`\`\`',
                        update_time: func.updateTime,
                    });
                }
            });
        },
    },
};
</script>

<style></style>
