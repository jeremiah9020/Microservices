/****************************************
*               ROLE TABLE              *
*                                       *
* 1 - Can see private posts             *
* 2 - Can see private cookbooks         *
* 4 - Can see user roles                *
* 8 - Can delete posts                  *
* 16 - Can delete cookbooks             *
* 32 - Can adjust user roles            *
* 64 - Can suspend users                *
* 128 - Can delete users                *
****************************************/

/** @typedef {{ canSeePrivatePosts: boolean, canSeePrivateCookbooks: boolean, canSeeRoles: boolean, canDeletePosts: boolean, canDeleteCookbooks: boolean, canAdjustRoles: boolean, canSuspendUsers: boolean, canDeleteUsers: boolean}} RoleObject */

/**
 * Converts a role object into a role number
 * @param {RoleObject} roleObject 
 * @returns {number} the role number
 */
const getRoleNumber = (roleObject) => {
    let role = 0;

    if (roleObject.canSeePrivatePosts) role |= 1
    if (roleObject.canSeePrivateCookbooks) role |= 2
    if (roleObject.canSeeRoles) role |= 4
    if (roleObject.canDeletePosts) role |= 8
    if (roleObject.canDeleteCookbooks) role |= 16
    if (roleObject.canAdjustRoles) role |= 32
    if (roleObject.canSuspendUsers) role |= 64
    if (roleObject.canDeleteUsers) role |= 128

    return role;
}

/**
 * Converts a role number into a role object
 * @param {number} roleNumber 
 * @returns {RoleObject} the role object
 */
const getRoleObject = (roleNumber) => {
    let role = {
        canSeePrivatePosts: false,
        canSeePrivateCookbooks: false,
        canSeeRoles: false,
        canDeletePosts: false,
        canDeleteCookbooks: false,
        canAdjustRoles: false,
        canSuspendUsers: false,
        canDeleteUsers: false
    };

    if (roleNumber & 1) role.canSeePrivatePosts = true;
    if (roleNumber & 2) role.canSeePrivateCookbooks = true;
    if (roleNumber & 4) role.canSeeRoles = true;
    if (roleNumber & 8) role.canDeletePosts = true;
    if (roleNumber & 16) role.canDeleteCookbooks = true;
    if (roleNumber & 32) role.canAdjustRoles = true;
    if (roleNumber & 64) role.canSuspendUsers = true;
    if (roleNumber & 128) role.canDeleteUsers = true;

    return role;
}

module.exports = { getRoleNumber, getRoleObject };