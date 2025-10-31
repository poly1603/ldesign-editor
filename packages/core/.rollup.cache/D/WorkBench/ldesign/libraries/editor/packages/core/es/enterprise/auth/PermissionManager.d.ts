/**
 * 权限管理器
 * 实现基于角色的访问控制（RBAC）
 */
import type { Permission, PermissionConfig, PermissionEvents, Role, User } from './types';
import { EventEmitter } from '../../core/EventEmitter';
export declare class PermissionManager extends EventEmitter<PermissionEvents> {
    private config;
    private currentUser?;
    private roles;
    private permissions;
    private userRoles;
    constructor(config?: PermissionConfig);
    /**
     * 初始化默认角色
     */
    private initializeDefaultRoles;
    /**
     * 初始化默认权限
     */
    private initializeDefaultPermissions;
    /**
     * 设置当前用户
     */
    setCurrentUser(user: User): void;
    /**
     * 获取当前用户
     */
    getCurrentUser(): User | undefined;
    /**
     * 添加角色
     */
    addRole(role: Role): void;
    /**
     * 获取角色
     */
    getRole(roleId: string): Role | undefined;
    /**
     * 分配角色给用户
     */
    assignRole(userId: string, roleId: string): void;
    /**
     * 移除用户角色
     */
    removeRole(userId: string, roleId: string): void;
    /**
     * 获取用户的所有权限
     */
    getUserPermissions(userId?: string): string[];
    /**
     * 解析角色权限（包括继承）
     */
    private resolveRolePermissions;
    /**
     * 检查权限
     */
    hasPermission(permissionId: string, userId?: string): boolean;
    /**
     * 检查多个权限（AND）
     */
    hasAllPermissions(permissionIds: string[], userId?: string): boolean;
    /**
     * 检查多个权限（OR）
     */
    hasAnyPermission(permissionIds: string[], userId?: string): boolean;
    /**
     * 检查角色
     */
    hasRole(roleId: string, userId?: string): boolean;
    /**
     * 权限断言（失败抛出异常）
     */
    assertPermission(permissionId: string, userId?: string): void;
    /**
     * 获取所有角色
     */
    getAllRoles(): Role[];
    /**
     * 获取所有权限
     */
    getAllPermissions(): Permission[];
    /**
     * 销毁
     */
    destroy(): void;
}
