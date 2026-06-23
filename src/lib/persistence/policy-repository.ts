import { PrismaClient } from '@prisma/client';

export interface PolicyVersion {
  policy_id: string;
  version: number;
  source_definition: string;
  compiled_hash: string;
  effective_date: Date | null;
  created_at: Date;
  created_by: string | null;
}

export class PolicyRepository {
  constructor(private prisma: PrismaClient) {}

  async findByCompositeKey(policy_id: string, version: number): Promise<PolicyVersion | null> {
    const policy = await this.prisma.policyVersion.findUnique({
      where: {
        policy_id_version: {
          policy_id,
          version,
        },
      },
    });

    return policy as PolicyVersion | null;
  }

  async findLatestVersion(policy_id: string): Promise<PolicyVersion | null> {
    const policy = await this.prisma.policyVersion.findFirst({
      where: { policy_id },
      orderBy: { version: 'desc' },
    });

    return policy as PolicyVersion | null;
  }

  async listVersions(policy_id: string, limit: number = 100): Promise<PolicyVersion[]> {
    const policies = await this.prisma.policyVersion.findMany({
      where: { policy_id },
      orderBy: { version: 'desc' },
      take: limit,
    });

    return policies as PolicyVersion[];
  }
}
