import { StudentProfile, Opportunity, RecommendationResult } from '../types';

/**
 * Normalizes skill strings for accurate semantic matching.
 */
function normalizeSkill(skill: string): string {
  const s = skill.trim().toLowerCase();
  const aliasMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'reactjs': 'react',
    'react.js': 'react',
    'nodejs': 'node.js',
    'node': 'node.js',
    'dsa': 'data structures & algorithms',
    'data structures': 'data structures & algorithms',
    'algorithms': 'data structures & algorithms',
    'postgres': 'postgresql',
    'aws cloud': 'aws',
    'amazon web services': 'aws',
    'spring': 'spring boot',
    'springboot': 'spring boot',
    'ml': 'machine learning',
    'ai': 'artificial intelligence',
    'k8s': 'kubernetes',
    'golang': 'go',
  };
  return aliasMap[s] || s;
}

/**
 * AI Recommendation Engine
 * Calculates a multidimensional suitability score (0-100%) between a student's profile
 * and a placement opportunity.
 *
 * Weight Distribution:
 * - Technical Skill Overlap: 45%
 * - Academic CGPA Score vs Cutoff: 25%
 * - Degree / Branch Eligibility: 15%
 * - Career Goal & Preferred Role Fit: 15%
 */
export function calculateOpportunityMatch(
  student: StudentProfile,
  opportunity: Opportunity
): RecommendationResult {
  const reasoningNotes: string[] = [];

  // 1. Skill Overlap Analysis (45% weight)
  const studentSkillsNorm = student.technicalSkills.map(normalizeSkill);
  const requiredSkillsNorm = opportunity.requiredSkills.map(normalizeSkill);
  const preferredSkillsNorm = (opportunity.preferredSkills || []).map(normalizeSkill);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  opportunity.requiredSkills.forEach((rawSkill) => {
    const norm = normalizeSkill(rawSkill);
    if (studentSkillsNorm.includes(norm)) {
      matchedSkills.push(rawSkill);
    } else {
      missingSkills.push(rawSkill);
    }
  });

  // Calculate skill overlap ratio
  const reqMatches = matchedSkills.length;
  const totalReq = Math.max(1, opportunity.requiredSkills.length);
  const requiredSkillRatio = reqMatches / totalReq;

  // Bonus for nice-to-have skills
  let preferredMatchCount = 0;
  preferredSkillsNorm.forEach((pSkill) => {
    if (studentSkillsNorm.includes(pSkill)) {
      preferredMatchCount++;
    }
  });
  const preferredBonus = preferredSkillsNorm.length > 0 ? (preferredMatchCount / preferredSkillsNorm.length) * 0.15 : 0;
  const rawSkillScore = Math.min(1.0, requiredSkillRatio + preferredBonus);
  const skillMatchPercentage = Math.round(rawSkillScore * 100);

  if (requiredSkillRatio >= 0.75) {
    reasoningNotes.push(`Strong technical match with ${matchedSkills.length}/${opportunity.requiredSkills.length} core required skills.`);
  } else if (requiredSkillRatio >= 0.4) {
    reasoningNotes.push(`Moderate skill alignment; learning ${missingSkills.slice(0, 2).join(', ')} will boost eligibility.`);
  } else {
    reasoningNotes.push(`High skill gap. Missing critical competencies: ${missingSkills.slice(0, 3).join(', ')}.`);
  }

  // 2. CGPA Criterion (25% weight)
  const isCgpaEligible = student.cgpa >= opportunity.minCgpa;
  let cgpaScoreWeight = 0;

  if (student.cgpa >= opportunity.minCgpa) {
    // Score based on how far above cutoff student is
    const diff = student.cgpa - opportunity.minCgpa;
    cgpaScoreWeight = Math.min(1.0, 0.8 + (diff / 2.0) * 0.2);
    reasoningNotes.push(`CGPA (${student.cgpa}) comfortably satisfies company benchmark (Min: ${opportunity.minCgpa}).`);
  } else {
    // Penalty for being below cutoff
    const gap = opportunity.minCgpa - student.cgpa;
    cgpaScoreWeight = Math.max(0, 0.5 - gap * 0.3);
    reasoningNotes.push(`CGPA (${student.cgpa}) is below the required cutoff of ${opportunity.minCgpa}.`);
  }

  // 3. Branch / Department Fit (15% weight)
  const studentBranchClean = student.branch.trim().toLowerCase();
  const isBranchEligible = opportunity.eligibleBranches.some((b) => {
    const bClean = b.toLowerCase();
    if (bClean === 'all branches' || bClean === 'all engineering branches') return true;
    return bClean.includes(studentBranchClean) || studentBranchClean.includes(bClean);
  });

  const branchScoreWeight = isBranchEligible ? 1.0 : 0.2;
  if (isBranchEligible) {
    reasoningNotes.push(`Branch '${student.branch}' is approved for this recruitment drive.`);
  } else {
    reasoningNotes.push(`Branch '${student.branch}' may require exceptional special dispensation.`);
  }

  // 4. Preferred Job Role Fit (15% weight)
  const opportunityRoleLower = opportunity.role.toLowerCase();
  const isRolePreferred = student.preferredJobRoles.some((pref) => {
    const prefLower = pref.toLowerCase();
    return (
      opportunityRoleLower.includes(prefLower) ||
      prefLower.includes(opportunityRoleLower) ||
      (prefLower.includes('software') && opportunityRoleLower.includes('software')) ||
      (prefLower.includes('frontend') && opportunityRoleLower.includes('frontend')) ||
      (prefLower.includes('data') && opportunityRoleLower.includes('data'))
    );
  });

  const roleScoreWeight = isRolePreferred ? 1.0 : 0.4;
  if (isRolePreferred) {
    reasoningNotes.push(`Role aligns directly with chosen career target: '${opportunity.role}'.`);
  }

  // Calculate composite weighted score
  const compositeScore =
    rawSkillScore * 45 +
    cgpaScoreWeight * 25 +
    branchScoreWeight * 15 +
    roleScoreWeight * 15;

  const matchScore = Math.min(99, Math.max(25, Math.round(compositeScore)));

  // Overall Eligibility evaluation
  let overallEligibility: 'Eligible' | 'Borderline' | 'Ineligible' = 'Eligible';
  if (!isCgpaEligible && !isBranchEligible) {
    overallEligibility = 'Ineligible';
  } else if (!isCgpaEligible || !isBranchEligible || matchScore < 60) {
    overallEligibility = 'Borderline';
  }

  return {
    opportunity,
    matchScore,
    skillMatchPercentage,
    isCgpaEligible,
    isBranchEligible,
    isRolePreferred,
    overallEligibility,
    matchedSkills,
    missingSkills,
    reasoningNotes,
  };
}

/**
 * Sorts and filters opportunities for a student with AI recommendations on top.
 */
export function getRecommendedOpportunities(
  student: StudentProfile,
  opportunities: Opportunity[]
): RecommendationResult[] {
  return opportunities
    .filter((opp) => opp.isActive)
    .map((opp) => calculateOpportunityMatch(student, opp))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Calculates overall Placement Readiness Score out of 100
 */
export function calculateOverallReadiness(scores: StudentProfile['readinessScores']): number {
  const weights = {
    technicalSkills: 0.25,
    codingPractice: 0.25,
    aptitude: 0.15,
    communicationSkills: 0.15,
    interviewPrep: 0.10,
    resumeQuality: 0.10,
  };

  const weighted =
    scores.technicalSkills * weights.technicalSkills +
    scores.codingPractice * weights.codingPractice +
    scores.aptitude * weights.aptitude +
    scores.communicationSkills * weights.communicationSkills +
    scores.interviewPrep * weights.interviewPrep +
    scores.resumeQuality * weights.resumeQuality;

  return Math.round(weighted);
}
