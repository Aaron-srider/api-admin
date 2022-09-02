<template>
    <!-- 修改 对话框 -->
    <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.visible"
        :width="width"
        :close-on-click-modal="false"
        @close="handle_close"
    >
        <slot :data="dialog.data"></slot>

        <span slot="footer" class="dialog-footer">
            <slot name="footer" :data="dialog.data"></slot>
        </span>
    </el-dialog>
</template>

<script>
import { ElDialog } from '@/lib/index';
export default {
    props: {
        dialog: ElDialog,
        width: {
            default: '30%',
        },
    },
    methods: {
        handle_close() {
            this.dialog.close();
        },
    },
};
</script>

<style></style>
