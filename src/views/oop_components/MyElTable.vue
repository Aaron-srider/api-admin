<template>
    <el-table border :data="el_table.data" style="width: 100%">
        <el-table-column
            v-for="col in el_table.cols"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
        >
            <template slot-scope="scope">
                <slot :row="scope.row" :col="col"></slot>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { ElTable } from '@/lib/index';
export default {
    props: {
        el_table: {
            type: ElTable,
        },
    },
};
</script>

<style></style>
