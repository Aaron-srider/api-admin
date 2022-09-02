<template>
    <el-pagination
        layout="prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pagesize"
        :current-page="pagination.pageno"
        @current-change="handle_pageno_change"
    ></el-pagination>
</template>

<script>
import { Page } from '@/lib/index';
export default {
    props: {
        pagination: Page,
    },
    methods: {
        // 给el-pagination绑定的翻页事件
        handle_pageno_change(pageno) {
            this.pagination.pageno = pageno;
            this.pagination.do_page();
        },
    },
};
</script>

<style></style>
