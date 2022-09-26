<template>
    <div>
        {{ display_value }}
    </div>
</template>

<script>
import {
    ArrayUtils,
    get_display_time,
    get_display_file_size,
    format_during,
} from '@/utils';
export default {
    computed: {
        display_value() {
            switch (this.type) {
                case 'time':
                    return get_display_time(new Date(this.value));

                case 'file-size':
                    return get_display_file_size(this.value);

                case 'duration':
                    return format_during(this.value);
                default:
                    return '';
            }
        },
    },
    methods: {
        get_display_time(last_update) {
            return get_display_time(new Date(last_update));
        },
    },
    created() {},
    data() {
        return {};
    },
    props: {
        value: '',
        type: '',
    },
};
</script>
