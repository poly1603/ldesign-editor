/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../../utils/event.js';
import { createLogger } from '../../utils/logger.js';

const logger = createLogger("PermissionManager");
class PermissionManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.roles = /* @__PURE__ */ new Map();
    this.permissions = /* @__PURE__ */ new Map();
    this.userRoles = /* @__PURE__ */ new Map();
    this.config = {
      strictMode: true,
      cachePermissions: true,
      inheritRoles: true,
      ...config
    };
    this.initializeDefaultRoles();
    this.initializeDefaultPermissions();
  }
  /**
   * 初始化默认角色
   */
  initializeDefaultRoles() {
    this.addRole({
      id: "admin",
      name: "\u7BA1\u7406\u5458",
      description: "\u62E5\u6709\u6240\u6709\u6743\u9650",
      permissions: ["*"],
      priority: 100
    });
    this.addRole({
      id: "editor",
      name: "\u7F16\u8F91\u8005",
      description: "\u53EF\u4EE5\u7F16\u8F91\u548C\u67E5\u770B\u5185\u5BB9",
      permissions: ["document.read", "document.write", "document.create", "document.delete", "comment.create", "comment.read"],
      priority: 50
    });
    this.addRole({
      id: "viewer",
      name: "\u67E5\u770B\u8005",
      description: "\u53EA\u80FD\u67E5\u770B\u5185\u5BB9",
      permissions: ["document.read", "comment.read"],
      priority: 10
    });
    this.addRole({
      id: "commenter",
      name: "\u8BC4\u8BBA\u8005",
      description: "\u53EF\u4EE5\u67E5\u770B\u548C\u8BC4\u8BBA",
      permissions: ["document.read", "comment.read", "comment.create"],
      inherits: ["viewer"],
      priority: 20
    });
  }
  /**
   * 初始化默认权限
   */
  initializeDefaultPermissions() {
    const permissions = [
      // 文档权限
      {
        id: "document.read",
        name: "\u8BFB\u53D6\u6587\u6863",
        resource: "document",
        action: "read"
      },
      {
        id: "document.write",
        name: "\u7F16\u8F91\u6587\u6863",
        resource: "document",
        action: "write"
      },
      {
        id: "document.create",
        name: "\u521B\u5EFA\u6587\u6863",
        resource: "document",
        action: "create"
      },
      {
        id: "document.delete",
        name: "\u5220\u9664\u6587\u6863",
        resource: "document",
        action: "delete"
      },
      {
        id: "document.share",
        name: "\u5206\u4EAB\u6587\u6863",
        resource: "document",
        action: "share"
      },
      {
        id: "document.export",
        name: "\u5BFC\u51FA\u6587\u6863",
        resource: "document",
        action: "export"
      },
      // 评论权限
      {
        id: "comment.read",
        name: "\u8BFB\u53D6\u8BC4\u8BBA",
        resource: "comment",
        action: "read"
      },
      {
        id: "comment.create",
        name: "\u521B\u5EFA\u8BC4\u8BBA",
        resource: "comment",
        action: "create"
      },
      {
        id: "comment.update",
        name: "\u7F16\u8F91\u8BC4\u8BBA",
        resource: "comment",
        action: "update"
      },
      {
        id: "comment.delete",
        name: "\u5220\u9664\u8BC4\u8BBA",
        resource: "comment",
        action: "delete"
      },
      // 协作权限
      {
        id: "collaboration.join",
        name: "\u52A0\u5165\u534F\u4F5C",
        resource: "collaboration",
        action: "join"
      },
      {
        id: "collaboration.invite",
        name: "\u9080\u8BF7\u534F\u4F5C",
        resource: "collaboration",
        action: "invite"
      },
      // 管理权限
      {
        id: "admin.users",
        name: "\u7BA1\u7406\u7528\u6237",
        resource: "admin",
        action: "users"
      },
      {
        id: "admin.roles",
        name: "\u7BA1\u7406\u89D2\u8272",
        resource: "admin",
        action: "roles"
      },
      {
        id: "admin.settings",
        name: "\u7BA1\u7406\u8BBE\u7F6E",
        resource: "admin",
        action: "settings"
      }
    ];
    permissions.forEach((p) => this.permissions.set(p.id, p));
  }
  /**
   * 设置当前用户
   */
  setCurrentUser(user) {
    this.currentUser = user;
    logger.info(`Current user set: ${user.name} (${user.id})`);
    if (user.roles)
      this.userRoles.set(user.id, user.roles);
    this.emit("user-changed", user);
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
      this.emit("role-assigned", {
        userId,
        roleId
      });
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
      this.emit("role-removed", {
        userId,
        roleId
      });
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
    const permissions = /* @__PURE__ */ new Set();
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
    if (role.permissions.includes("*")) {
      this.permissions.forEach((p) => permissions.add(p.id));
      return;
    }
    role.permissions.forEach((p) => permissions.add(p));
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
    if (userPermissions.includes(permissionId))
      return true;
    if (userPermissions.includes("*"))
      return true;
    const parts = permissionId.split(".");
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
    return permissionIds.every((id) => this.hasPermission(id, userId));
  }
  /**
   * 检查多个权限（OR）
   */
  hasAnyPermission(permissionIds, userId) {
    return permissionIds.some((id) => this.hasPermission(id, userId));
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
      this.emit("permission-denied", {
        permissionId,
        userId: userId || this.currentUser?.id
      });
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
    this.currentUser = void 0;
    this.removeAllListeners();
  }
}

export { PermissionManager };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=PermissionManager.js.map
