// USER COMPONENT INTERFACES

export interface UserStats {
  allQuestionsCount: [
    {
      difficulty: string;
      count: number;
    }
  ];
  matchedUser: {
    submitStats: {
      acSubmissionNum: [
        {
          difficulty: string;
          count: number;
        }
      ];
    };
  };
}

// DAILY COMPONENT INTERFACES

export interface DailyProblemData {
  link: string;
  question: {
    difficulty: string;
    title: string;
    topicTags: {
      name: string;
    }[];
  };
}

// RANDOM COMPONENT INTERFACES

export interface Filters {
  difficulty?: string;
  tags?: string[];
}

export interface Topics {
  name: string;
}

export interface Problem {
  difficulty: string;
  paidOnly: boolean;
  title: string;
  titleSlug: string;
  topicTags: [
    {
      name: string;
    }
  ];
}
