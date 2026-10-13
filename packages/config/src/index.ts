export const deploymentEnvironments = ["development", "test", "staging", "production"] as const;

export type DeploymentEnvironment = (typeof deploymentEnvironments)[number];

export function isDeploymentEnvironment(value: string): value is DeploymentEnvironment {
  return deploymentEnvironments.some((environment) => environment === value);
}
