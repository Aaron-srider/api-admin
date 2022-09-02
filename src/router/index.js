import Vue from 'vue';
import Router from 'vue-router';
import { cloneDeep } from '@/utils/route';
Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export let srcRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true,
        auth: false,
    },

    {
        path: '/my_profile',
        component: Layout,
        redirect: '/my_profile/index',
        name: 'my_profile',
        meta: { title: '我的信息', icon: 'el-icon-s-help' },
        alwaysShow: false,
        hidden: true,
        children: [
            {
                auth: false,
                path: 'index',
                name: 'my_profile_index',
                component: () => import('@/views/user_profile/index'),
                meta: { title: '我的信息', icon: 'form' },
            },
        ],
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        auth: false,
        hidden: true,
    },

    {
        path: '/',
        component: Layout,
        auth: false,
        redirect: '/login',
    },

    {
        path: '/device',
        component: Layout,
        redirect: '/device/totp',
        name: 'device',
        alwaysShow: false,
        meta: { title: '设备', icon: 'el-icon-s-help' },
        children: [
            {
                path: 'totp',
                name: 'device_totp',
                component: () => import('@/views/device/index'),
                meta: {
                    title: '设备TOTP',
                    icon: 'ali-international-icon-inspection',
                },
            },
        ],
    },

    {
        path: '/open-api',
        component: Layout,
        redirect: '/open-api/my-app-account',
        name: 'device',
        alwaysShow: false,
        meta: { title: '开放接口', icon: 'el-icon-s-help' },
        children: [
            {
                path: 'my-app-account',
                name: 'open-api_my-app-account',
                component: () =>
                    import('@/views/open-api/my-app-account/index'),
                meta: {
                    title: '第三方应用',
                    icon: 'ali-international-icon-mini-program-line',
                },
            },
        ],
    },

    {
        path: '/user_manage',
        component: Layout,
        redirect: '/user_manage/index',
        name: 'device',
        alwaysShow: false,
        meta: {
            title: '用户管理',
            icon: 'ali-international-icon-zhanghucaozuo',
        },
        children: [
            {
                path: 'index',
                name: 'user_manage-user_role',
                component: () => import('@/views/user_manage/index'),
                meta: {
                    title: '用户角色',
                    icon: 'ali-international-icon-becomeagoldsupplier',
                },
            },
            {
                path: 'menu',
                name: 'user_manage-user_menu',
                component: () => import('@/views/user_manage/menu/index'),
                meta: {
                    title: '菜单管理',
                    icon: 'ali-international-icon-signboard',
                },
            },

            {
                path: 'permission',
                name: 'user_manage-permission',
                component: () => import('@/views/user_manage/permission/index'),
                meta: { title: '权限管理', icon: 'form' },
            },
            // {
            //     path: 'api-resource',
            //     name: 'user_manage-api-resource',
            //     component: () =>
            //         import('@/views/user_manage/api-resource/index'),
            //     meta: { title: '后端接口资源', icon: 'form' },
            // },

            {
                path: 'role',
                name: 'user_manage-role',
                component: () => import('@/views/user_manage/role/index'),
                meta: {
                    title: '角色管理',
                    icon: 'ali-international-icon-quanyipeizhi',
                },
            },
        ],
    },

    {
        path: '/log',
        component: Layout,
        redirect: '/log/index',
        name: 'log',
        alwaysShow: false,
        meta: {
            title: '日志管理',
            icon: 'ali-international-icon-shenqingjilu',
        },
        children: [
            {
                path: 'index',
                name: 'log_index',
                component: () => import('@/views/log/index'),
                meta: {
                    title: '查看日志',
                    icon: 'ali-international-icon-shenqingjilu',
                },
            },
        ],
    },

    {
        path: '/device_admin',
        component: Layout,
        redirect: '/device_admin/device_template',
        name: 'device_admin',
        alwaysShow: false,
        meta: { title: '设备管理', icon: 'ali-international-icon-template' },
        children: [
            {
                path: 'device_template',
                name: 'device_admin-device_template',
                component: () =>
                    import('@/views/device_admin/device_template/index'),
                meta: {
                    title: '设备模板管理',
                    icon: 'ali-international-icon-template',
                },
            },
        ],
    },

    {
        path: '/api-admin',
        component: Layout,
        redirect: '/api-admin/index',
        name: 'api-admin',
        alwaysShow: false,
        meta: { title: '设备管理', icon: 'ali-international-icon-template' },
        children: [
            {
                path: 'index',
                name: 'api-admin_index',
                component: () =>
                    import('@/views/api-admin/index'),
                meta: {
                    title: '接口文档',
                    icon: 'ali-international-icon-template',
                },
            },
        ],
    },

    // // 方便调试的工具页面
    // {
    //     path: '/utils',
    //     component: Layout,
    //     redirect: '/utils/js-request-function',
    //     name: 'utils',
    //     meta: { title: '工具', icon: 'el-icon-s-help' },
    //     alwaysShow: false,
    //     auth: false,
    //     children: [
    //         {
    //             path: 'js-request-function',
    //             name: 'utils_js-request-function',
    //             component: () =>
    //                 import('@/views/utils/js-request-function/index'),

    //             meta: { title: 'js请求函数', icon: 'form' },
    //         },
    //     ],
    // },

    // 404 page must be placed at the end !!!

    { path: '*', redirect: '/404', hidden: true, auth: false },
];

// export var routes = cloneDeep(srcConstantRoutes);
export let routes = srcRoutes;
let copy_routes_for_sidebar = cloneDeep(srcRoutes);
export function reset_sidebar_routes() {
    copy_routes_for_sidebar = cloneDeep(srcRoutes);
}

export function clean_sidebar_routes() {
    copy_routes_for_sidebar = [
        { path: '*', redirect: '/404', hidden: true, auth: false },
    ];
}

export function get_sidebar_routes() {
    return copy_routes_for_sidebar;
}
export { copy_routes_for_sidebar };

const createRouter = () =>
    new Router({
        mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: routes,
    });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
