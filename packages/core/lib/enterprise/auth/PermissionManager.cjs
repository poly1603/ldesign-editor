/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var event = require('../../utils/event.cjs');
var logger$1 = require('../../utils/logger.cjs');

/**
 * 权限管理器
 * 实现基于角色的访问控制（RBAC）
 */
const logger = logger$1.createLogger('PermissionManager');
class PermissionManager extends event.EventEmitter {
    constructor(config = {}) {
        super();
        this.roles = new Map();
        this.permissions = new Map();
        this.userRoles = new Map();
        this.config = {
            strictMode: true,
            cachePermissions: true,
            inheritRoles: true,
            ...config,
        };
        this.initializeDefaultRoles();
        this.initializeDefaultPermissions();
    }
    /**
     * 初始化默认角色
     */
    initializeDefaultRoles() {
        // 管理员角色
        this.addRole({
            id: 'admin',
            name: '管理员',
            description: '拥有所有权限',
            permissions: ['*'],
            priority: 100,
        });
        // 编辑角色
        this.addRole({
            id: 'editor',
            name: '编辑者',
            description: '可以编辑和查看内容',
            permissions: [
                'document.read',
                'document.write',
                'document.create',
                'document.delete',
                'comment.create',
                'comment.read',
            ],
            priority: 50,
        });
        // 查看者角色
        this.addRole({
            id: 'viewer',
            name: '查看者',
            description: '只能查看内容',
            permissions: [
                'document.read',
                'comment.read',
            ],
            priority: 10,
        });
        // 评论者角色
        this.addRole({
            id: 'commenter',
            name: '评论者',
            description: '可以查看和评论',
            permissions: [
                'document.read',
                'comment.read',
                'comment.create',
            ],
            inherits: ['viewer'],
            priority: 20,
        });
    }
    /**
     * 初始化默认权限
     */
    initializeDefaultPermissions() {
        const permissions = [
            // 文档权限
            { id: 'document.read', name: '读取文档', resource: 'document', action: 'read' },
            { id: 'document.write', name: '编辑文档', resource: 'document', action: 'write' },
            { id: 'document.create', name: '创建文档', resource: 'document', action: 'create' },
            { id: 'document.delete', name: '删除文档', resource: 'document', action: 'delete' },
            { id: 'document.share', name: '分享文档', resource: 'document', action: 'share' },
            { id: 'document.export', name: '导出文档', resource: 'document', action: 'export' },
            // 评论权限
            { id: 'comment.read', name: '读取评论', resource: 'comment', action: 'read' },
            { id: 'comment.create', name: '创建评论', resource: 'comment', action: 'create' },
            { id: 'comment.update', name: '编辑评论', resource: 'comment', action: 'update' },
            { id: 'comment.delete', name: '删除评论', resource: 'comment', action: 'delete' },
            // 协作权限
            { id: 'collaboration.join', name: '加入协作', resource: 'collaboration', action: 'join' },
            { id: 'collaboration.invite', name: '邀请协作', resource: 'collaboration', action: 'invite' },
            // 管理权限
            { id: 'admin.users', name: '管理用户', resource: 'admin', action: 'users' },
            { id: 'admin.roles', name: '管理角色', resource: 'admin', action: 'roles' },
            { id: 'admin.settings', name: '管理设置', resource: 'admin', action: 'settings' },
        ];
        permissions.forEach(p => this.permissions.set(p.id, p));
    }
    /**
     * 设置当前用户
     */
    setCurrentUser(user) {
        this.currentUser = user;
        logger.info(`Current user set: ${user.name} (${user.id})`);
        // 加载用户角色
        if (user.roles)
            this.userRoles.set(user.id, user.roles);
        this.emit('user-changed', user);
    }
    /**
     * 获取当前用户
     */
    getCurrentUser() {
        return this.currentUser;
    }
    /**
     * 添加角色
     */
    addRole(role) {
        this.roles.set(role.id, role);
        logger.debug(`Role added: ${role.name}`);
    }
    /**
     * 获取角色
     */
    getRole(roleId) {
        return this.roles.get(roleId);
    }
    /**
     * 分配角色给用户
     */
    assignRole(userId, roleId) {
        const role = this.roles.get(roleId);
        if (!role)
            throw new Error(`Role not found: ${roleId}`);
        const userRoles = this.userRoles.get(userId) || [];
        if (!userRoles.includes(roleId)) {
            userRoles.push(roleId);
            this.userRoles.set(userId, userRoles);
            logger.info(`Assigned role ${roleId} to user ${userId}`);
            this.emit('role-assigned', { userId, roleId });
        }
    }
    /**
     * 移除用户角色
     */
    removeRole(userId, roleId) {
        const userRoles = this.userRoles.get(userId) || [];
        const index = userRoles.indexOf(roleId);
        if (index > -1) {
            userRoles.splice(index, 1);
            this.userRoles.set(userId, userRoles);
            logger.info(`Removed role ${roleId} from user ${userId}`);
            this.emit('role-removed', { userId, roleId });
        }
    }
    /**
     * 获取用户的所有权限
     */
    getUserPermissions(userId) {
        const uid = userId || this.currentUser?.id;
        if (!uid)
            return [];
        const userRoles = this.userRoles.get(uid) || [];
        const permissions = new Set();
        userRoles.forEach((roleId) => {
            const role = this.roles.get(roleId);
            if (role)
                this.resolveRolePermissions(role, permissions);
        });
        return Array.from(permissions);
    }
    /**
     * 解析角色权限（包括继承）
     */
    resolveRolePermissions(role, permissions) {
        // 添加角色的直接权限
        if (role.permissions.includes('*')) {
            // 通配符，拥有所有权限
            this.permissions.forEach(p => permissions.add(p.id));
            return;
        }
        role.permissions.forEach(p => permissions.add(p));
        // 处理继承
        if (this.config.inheritRoles && role.inherits) {
            role.inherits.forEach((parentRoleId) => {
                const parentRole = this.roles.get(parentRoleId);
                if (parentRole)
                    this.resolveRolePermissions(parentRole, permissions);
            });
        }
    }
    /**
     * 检查权限
     */
    hasPermission(permissionId, userId) {
        const uid = userId || this.currentUser?.id;
        if (!uid)
            return !this.config.strictMode;
        const userPermissions = this.getUserPermissions(uid);
        // 检查精确匹配
        if (userPermissions.includes(permissionId))
            return true;
        // 检查通配符
        if (userPermissions.includes('*'))
            return true;
        // 检查资源级别通配符
        const parts = permissionId.split('.');
        if (parts.length > 1) {
            const resourceWildcard = `${parts[0]}.*`;
            if (userPermissions.includes(resourceWildcard))
                return true;
        }
        return false;
    }
    /**
     * 检查多个权限（AND）
     */
    hasAllPermissions(permissionIds, userId) {
        return permissionIds.every(id => this.hasPermission(id, userId));
    }
    /**
     * 检查多个权限（OR）
     */
    hasAnyPermission(permissionIds, userId) {
        return permissionIds.some(id => this.hasPermission(id, userId));
    }
    /**
     * 检查角色
     */
    hasRole(roleId, userId) {
        const uid = userId || this.currentUser?.id;
        if (!uid)
            return false;
        const userRoles = this.userRoles.get(uid) || [];
        return userRoles.includes(roleId);
    }
    /**
     * 权限断言（失败抛出异常）
     */
    assertPermission(permissionId, userId) {
        if (!this.hasPermission(permissionId, userId)) {
            const error = new Error(`Permission denied: ${permissionId}`);
            this.emit('permission-denied', { permissionId, userId: userId || this.currentUser?.id });
            throw error;
        }
    }
    /**
     * 获取所有角色
     */
    getAllRoles() {
        return Array.from(this.roles.values());
    }
    /**
     * 获取所有权限
     */
    getAllPermissions() {
        return Array.from(this.permissions.values());
    }
    /**
     * 销毁
     */
    destroy() {
        this.roles.clear();
        this.permissions.clear();
        this.userRoles.clear();
        this.currentUser = undefined;
        this.removeAllListeners();
    }
}

exports.PermissionManager = PermissionManager;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=PermissionManager.cjs.map
