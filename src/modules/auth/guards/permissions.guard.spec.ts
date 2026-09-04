import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { ANY_PERMISSIONS_KEY, PERMISSIONS_KEY } from '../decorators/permissions.decorator';

function buildReflector(metadata: Record<string, string[] | undefined>): Reflector {
  return {
    getAllAndOverride: (key: string) => metadata[key],
  } as unknown as Reflector;
}

function buildContext(user: { permissions: string[] } | undefined): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard', () => {
  it('allows access when no permissions are required', () => {
    const reflector = { getAllAndOverride: () => undefined } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);
    expect(guard.canActivate(buildContext({ permissions: [] }))).toBe(true);
  });

  it('allows access when the user has all required permissions', () => {
    const reflector = {
      getAllAndOverride: () => ['players:view'],
    } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);
    expect(guard.canActivate(buildContext({ permissions: ['players:view', 'finance:view'] }))).toBe(
      true,
    );
  });

  it('throws ForbiddenException when the user is missing a required permission', () => {
    const reflector = {
      getAllAndOverride: () => ['finance:manage'],
    } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);
    expect(() => guard.canActivate(buildContext({ permissions: ['players:view'] }))).toThrow(
      ForbiddenException,
    );
  });

  it('throws ForbiddenException when there is no authenticated user', () => {
    const reflector = {
      getAllAndOverride: () => ['players:view'],
    } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);
    expect(() => guard.canActivate(buildContext(undefined))).toThrow(ForbiddenException);
  });

  it('allows access when the user has at least one of the RequireAnyPermission set', () => {
    const reflector = buildReflector({ [ANY_PERMISSIONS_KEY]: ['training:approve', 'training:manage-own'] });
    const guard = new PermissionsGuard(reflector);
    expect(
      guard.canActivate(buildContext({ permissions: ['training:manage-own'] })),
    ).toBe(true);
  });

  it('throws ForbiddenException when the user has none of the RequireAnyPermission set', () => {
    const reflector = buildReflector({ [ANY_PERMISSIONS_KEY]: ['training:approve', 'training:manage-own'] });
    const guard = new PermissionsGuard(reflector);
    expect(() => guard.canActivate(buildContext({ permissions: ['players:view'] }))).toThrow(
      ForbiddenException,
    );
  });

  it('requires both the AND set and the OR set when both are present', () => {
    const reflector = buildReflector({
      [PERMISSIONS_KEY]: ['players:view'],
      [ANY_PERMISSIONS_KEY]: ['training:approve', 'training:manage-own'],
    });
    const guard = new PermissionsGuard(reflector);
    expect(
      guard.canActivate(buildContext({ permissions: ['players:view', 'training:approve'] })),
    ).toBe(true);
    expect(() =>
      guard.canActivate(buildContext({ permissions: ['players:view'] })),
    ).toThrow(ForbiddenException);
  });
});
