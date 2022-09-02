import { Message } from 'element-ui';

export function fetch_options_to_this(options) {
    var keys = Object.keys(options);
    keys.forEach((key) => {
        var value = options[key];
        this[key] = value;
    });
}

export class ElDialog {
    constructor(title, options) {
        fetch_options_to_this.call(this, options);
        this.reset_data();
        this.title = title;
        this.visible = false;
    }

    open(data) {
        this.before_open(data);
    }

    commit(data) {
        var enable_commit = this.enable_commit(data);
        if (enable_commit === true) {
            this.do_commit(data);
        } else {
            Message.warning('请将表单填写完整后提交');
        }
    }

    do_commit(data) {}

    enable_commit(data) {
        return true;
    }

    // 这个函数，可以在option里重写覆盖
    before_open(data) {
        this.do_open();
    }

    do_open() {
        this.visible = true;
    }

    // 重置data为默认的结构，可以复写这个方法
    reset_data(data) {
        this.data = {};
    }

    // 关闭表单清除信息
    close() {
        this.before_close();
        this.visible = false;
        this.reset_data();
    }

    before_close() {}
}
export class ElPagination {
    constructor(pageno, pagesize, options) {
        this.total = 0;
        this.pageno = pageno;
        this.pagesize = pagesize;
        fetch_options_to_this.call(this, options);
    }

    page(data) {
        console.log(
            `开始分页操作,页码${this.pageno},页面大小:${this.pagesize}`,
        );
        this.do_page(data);
    }

    // 可以重写
    do_page(data) {
        console.log(`默认的分页操作,do nothing`);
    }
}
export class ElTable {
    constructor(title, options) {
        this.data = [];
        this.title = title;
        this.cols = [
            { prop: 'col1_prop_name', label: 'col1_label_name' },
            { prop: 'col2_prop_name', label: 'col2_label_name' },
        ];
        fetch_options_to_this.call(this, options);
    }

    fetch_data(data) {
        console.log(`表格 ${this.title} 开始拉取数据`);
        this.do_fetch_data(data);
    }

    // 可以重写
    do_fetch_data(data) {
        this.data = [];
    }
}

export class MyElCompletion {
    constructor(placeholder, options) {
        fetch_options_to_this.call(this, options);
        this.value = '';
        this.placeholder = placeholder;
        this.reset_data();
    }

    fetch_suggestions(query_string, cb) {
        cb(['value1', 'value2', 'value3']);
    }

    reset_data() {}

    do_select(row) {
        console.log('select row: ', row);
    }
}

// 与MyElPagination匹配的对象，记录分页信息，负责分页操作
export class Page {
    constructor(pageno, pagesize, options) {
        this.pageno = pageno;
        this.pagesize = pagesize;
        this.total = 0;

        fetch_options_to_this.call(this, options);
    }

    // 用户覆盖该方法，实现翻页
    do_page(data) {}
}
