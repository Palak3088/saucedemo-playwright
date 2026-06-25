// Single source of truth for all SauceDemo test accounts.

export const PASSWORD = 'secret_sauce' as const;
export type Password = typeof PASSWORD;

export interface User {
  username: string;
  password: Password;
}

// `as const` preserves literal types on every username value.
// `satisfies Record<string, User>` validates the shape at compile time
//  without widening those literals to `string`.
export const USERS = {
  standard:    { username: 'standard_user',            password: PASSWORD },
  locked:      { username: 'locked_out_user',          password: PASSWORD },
  problem:     { username: 'problem_user',             password: PASSWORD },
  performance: { username: 'performance_glitch_user',  password: PASSWORD },
  error:       { username: 'error_user',               password: PASSWORD },
  visual:      { username: 'visual_user',              password: PASSWORD },
} as const satisfies Record<string, User>;

// Useful for functions that accept any valid user key.
export type UserKey = keyof typeof USERS;
