<template>
    <div>
        <el-autocomplete
            style="width: 100%"
            class="inline-input"
            v-model="el_autocompletion.value"
            :fetch-suggestions="fetch_suggestions"
            :placeholder="el_autocompletion.placeholder"
            :trigger-on-focus="true"
            @select="handle_select"
        >
            <template slot-scope="{ item }">
                <slot :row="item"></slot>
            </template>
        </el-autocomplete>
    </div>
</template>

<script>
import { MyElCompletion } from '@/lib/index';
export default {
    props: {
        el_autocompletion: {
            type: MyElCompletion,
        },
        select_prop: String,
    },
    methods: {
        fetch_suggestions(query_string, cb) {
            this.el_autocompletion.fetch_suggestions(query_string, cb);
        },
        handle_select(row) {
            this.el_autocompletion.value = row[this.select_prop];
            this.el_autocompletion.do_select(row);
        },
    },
};
</script>

<style></style>
