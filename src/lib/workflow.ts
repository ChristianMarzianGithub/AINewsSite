export const allowedTransitions: Record<string, readonly string[]> = {
  GENERATED: ["DRAFT", "APPROVED", "REJECTED"],
  DRAFT: ["APPROVED", "REJECTED"],
  APPROVED: ["PUBLISHED", "DRAFT", "REJECTED"],
  PUBLISHED: ["DRAFT"],
  REJECTED: ["DRAFT"],
};

export function canTransition(from: string, to: string) { return allowedTransitions[from]?.includes(to) ?? false; }
