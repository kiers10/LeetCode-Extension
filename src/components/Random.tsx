import {
  Button,
  Autocomplete,
  Tab,
  Tabs,
  TextField,
  Chip,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Filters, Problem } from "../Interfaces";
import { getColor, openInNewTab } from "../Functions";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  LEETCODE_API_ENDPOINT,
  // LEETCODE_API_TOPICS_ENDPOINT,
  LEETCODE_TOPICS,
  LEETCODE_WEBSITE_URL,
} from "../Constants";

const PROBLEMS_QUERY = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
    ) {
        total: totalNum
        questions: data {
            difficulty
            paidOnly: isPaidOnly
            title
            titleSlug
            topicTags {
                name
            }
        }
    }
}`;

const NUMBER_OF_PROBLEMS_QUERY = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
    ) {
        total: totalNum
    }
}`;

const EmptyProblem = {
  difficulty: "Easy",
  paidOnly: false,
  title: "Two Sum",
  titleSlug: "/two-sum",
  topicTags: [
    {
      name: "Array",
    },
    {
      name: "Graph",
    },
  ],
};

const Random = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("ANY");

  const [selectedTopic, setSelectedTopic] = useState<string | undefined>("Any");
  const [inputTopic, setInputTopic] = useState<string>("Any");

  const [filters, setFilters] = useState<Filters>({});
  // const [topics, setTopics] = useState<Topics[]>([{ name: "Any" }]);

  const [numberOfProbelems, setNumberOfProblems] = useState(0);
  const [randomProblem, setRandomProblem] = useState<Problem>(
    EmptyProblem as Problem
  );

  const [displayRandomProblem, setDisplayRandomProblem] = useState(false);
  const [loading, setLoading] = useState(false);

  const [displayTopics, setDisplayTopics] = useState(false);

  useEffect(() => {
    console.log("Filters", filters);
  }, [filters]);

  // useEffect(() => {
  //   console.log("topics", topics);
  // }, [topics]);

  // useEffect(() => {
  //   const fetchTopics = async () => {
  //     console.log(`Fetching topics from LeetCode API.`);

  //     const init = {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     };

  //     const response = await fetch(LEETCODE_API_TOPICS_ENDPOINT, init);
  //     const resData = await response.json();
  //     setTopics(resData.pageProps.topicTags);
  //   };

  //   fetchTopics();
  // }, []);

  useEffect(() => {
    console.log("number of problems", numberOfProbelems);
    if (numberOfProbelems !== 0) {
      fetchRandomProblem();
      setDisplayRandomProblem(true);
    }
  }, [numberOfProbelems]);

  const fetchNumberOfProblems = async () => {
    console.log(`Fetching number of problems from LeetCode API.`);

    const init = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: NUMBER_OF_PROBLEMS_QUERY,
        variables: {
          categorySlug: "",
          filters: filters,
          limit: 1,
          skip: 0,
        },
      }),
    };

    const response = await fetch(LEETCODE_API_ENDPOINT, init);
    const resData = await response.json();
    setNumberOfProblems(resData.data.problemsetQuestionList.total);
  };

  useEffect(() => {
    console.log("random problem", randomProblem);
    setLoading(false);
  }, [randomProblem]);

  const fetchRandomProblem = async () => {
    console.log(`Fetching problem from LeetCode API.`);

    setLoading(true);

    const randomProblemNumber = Math.random() * numberOfProbelems;

    const init = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: PROBLEMS_QUERY,
        variables: {
          categorySlug: "",
          filters: filters,
          limit: 1,
          skip: randomProblemNumber,
        },
      }),
    };

    const response = await fetch(LEETCODE_API_ENDPOINT, init);
    const resData = await response.json();
    setRandomProblem(resData.data.problemsetQuestionList.questions[0]);
  };

  const handleChangeDifficulty = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setSelectedDifficulty(newValue);

    if (newValue !== "ANY") {
      setFilters({ ...filters, difficulty: newValue });
    } else {
      delete filters.difficulty;
    }
  };

  const handleChangeTopic = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTopic(newValue);

    let topic = newValue
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace("(", "")
      .replace(")", "");

    if (newValue !== "Any") {
      setFilters({ ...filters, tags: [topic] });
    } else {
      delete filters.tags;
    }
  };

  const topicsDropdown = LEETCODE_TOPICS.map((topic) => topic);
  topicsDropdown.unshift("Any");

  const getTopics = randomProblem.topicTags.map((topic, idx, arr) => {
    return (
      <p className="topics">
        {topic.name}
        {idx !== arr.length - 1 ? "," : ""}
      </p>
    );
  });

  return (
    <div className="random-wrapper">
      <p className="random-title">Random Problem</p>
      {displayRandomProblem ? (
        <>
          <div className="problem box" style={{ position: "relative" }}>
            <Backdrop open={loading} sx={{ position: "absolute" }}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <p className="problem-title">{randomProblem.title}</p>
            <Chip
              label={randomProblem.difficulty}
              size="small"
              color={getColor(randomProblem.difficulty)}
              variant="outlined"
              className="difficulty-chip"
              sx={{ height: "18px" }}
            />
            <br />
            {displayTopics && (
              <div
                className="topics-wrapper"
                style={{ justifyContent: "center" }}
              >
                {getTopics}
              </div>
            )}
            <Button
              size="small"
              className="show-topics-btn"
              onClick={() => setDisplayTopics((prev) => !prev)}
            >
              {displayTopics ? "Hide Topics" : "Show Topics"}
            </Button>
            <motion.div
              className="open-in-new-icon"
              onClick={() =>
                openInNewTab(
                  LEETCODE_WEBSITE_URL.concat("/problems/").concat(
                    randomProblem.titleSlug
                  )
                )
              }
              whileHover={{
                scale: 1.05,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <OpenInNewIcon sx={{ fontSize: "20px" }} />
            </motion.div>
          </div>
          <Button
            variant="outlined"
            color="warning"
            sx={{ fontSize: "10px", marginTop: "1.5rem" }}
            component={motion.div}
            whileHover={{
              scale: 1.05,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => setDisplayRandomProblem(false)}
          >
            Generate a New Random Problem
          </Button>
        </>
      ) : (
        <div className="get-problem">
          <div className="random-difficulty-wrapper">
            <p className="random-subtitle">Difficulty:</p>
            <Tabs
              value={selectedDifficulty}
              onChange={handleChangeDifficulty}
              centered
              indicatorColor="primary"
            >
              <Tab
                value="ANY"
                label="Any"
                sx={{ fontSize: "10px" }}
                className="tab"
              />
              <Tab
                value="EASY"
                label="Easy"
                sx={{ fontSize: "10px" }}
                className="tab"
              />
              <Tab
                value="MEDIUM"
                label="Medium"
                sx={{ fontSize: "10px" }}
                className="tab"
              />
              <Tab
                value="HARD"
                label="Hard"
                sx={{ fontSize: "10px" }}
                className="tab"
              />
            </Tabs>
          </div>
          <div className="random-topic-wrapper">
            <p className="random-subtitle">Topic:</p>
            <Autocomplete
              id="topics-dropdown"
              className="random-topics-dropdown"
              disableClearable
              value={selectedTopic}
              onChange={handleChangeTopic}
              inputValue={inputTopic}
              onInputChange={(event, newInputValue) => {
                setInputTopic(newInputValue);
              }}
              defaultValue={"Any"}
              options={topicsDropdown}
              renderInput={(params) => (
                <TextField {...params} variant="standard" />
              )}
              sx={{
                width: "150px",
              }}
            />
          </div>
          <Button
            variant="outlined"
            color="warning"
            sx={{ fontSize: "10px", marginTop: "1.5rem", marginBottom: "1rem" }}
            component={motion.div}
            whileHover={{
              scale: 1.05,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={fetchNumberOfProblems}
          >
            Generate Random Problem
          </Button>
        </div>
      )}
    </div>
  );
};

export default Random;
