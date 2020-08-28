import * as types from '@/types/codeset'
const getters = {
    classData: state => state.ClassSelect.classData,
    codeData:state => state.codeSet[types.STATE_CODES],
    TOKEN:state => state.USER && state.USER.token || '',
    permissionRoutes: state => state.permission.routes,
    permissionMenus: state => state.permission.menus,
    permissionMenuId: state => state.permission.menuId,
    permissionSubMenu: state => state.permission.subMenu,
    cachedViews: state => state.cachedViews.cachedViews,
    authPageBtns: state => state.cachedViews.authPageBtns
};
export default getters
