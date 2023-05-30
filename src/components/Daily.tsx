import { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Backdrop, Button, Chip, CircularProgress } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { motion } from "framer-motion";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { DailyProblemData } from "../Interfaces";
import { getColor, openInNewTab } from "../Functions";
import { LEETCODE_API_ENDPOINT, LEETCODE_WEBSITE_URL } from "../Constants";

const DAILY_CODING_CHALLENGE_QUERY = `
query questionOfToday {
    activeDailyCodingChallengeQuestion {
        date
        userStatus
        link
        question {
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

const SampleDailyProblemData = {
  link: "",
  question: {
    difficulty: "Easy",
    title: "Sample Problem",
    topicTags: [
      {
        name: "Graph",
      },
      {
        name: "Array",
      },
      {
        name: "Linked List",
      },
      {
        name: "Dynamic Programming",
      },
      {
        name: "Design",
      },
    ],
  },
};

const Daily = () => {
  const [problemOfDay, setProblemOfDay] = useState<DailyProblemData>(
    SampleDailyProblemData
  );
  const [loading, setLoading] = useState(false);

  const [month, setMonth] = useState("");
  const [day, setDay] = useState(0);
  const [displayTopics, setDisplayTopics] = useState(false);

  useEffect(() => {
    setLoading(true);

    getTodaysDate();

    const fetchDailyCodingChallenge = async () => {
      console.log(`Fetching daily coding challenge from LeetCode API.`);

      const init = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: DAILY_CODING_CHALLENGE_QUERY }),
      };

      const response = await fetch(LEETCODE_API_ENDPOINT, init);
      const resData = await response.json();
      setProblemOfDay(resData.data.activeDailyCodingChallengeQuestion);
    };

    fetchDailyCodingChallenge();
  }, []);

  useEffect(() => {
    console.log(problemOfDay);
    setLoading(false);
  }, [problemOfDay]);

  const getTodaysDate = () => {
    const date = new Date();
    setMonth(date.toLocaleString("default", { month: "short" }));
    setDay(date.getDate());
  };

  const getTopics = problemOfDay.question.topicTags.map((topic, idx, arr) => {
    return (
      <p className="topics">
        {topic.name}
        {idx !== arr.length - 1 ? "," : ""}
      </p>
    );
  });

  return (
    <div className="daily-wrapper box">
      <Backdrop open={loading} sx={{ position: "absolute" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={2}>
        <Grid xs={4.5} className="daily-date">
          <div style={{ position: "relative" }}>
            <CalendarTodayIcon
              sx={{ fontSize: "80px", color: "#8b8b8b !important" }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                fontSize: "12px",
              }}
            >
              <p style={{ margin: "32px auto 0" }}>{month}</p>
              <p style={{ margin: 0 }}>{day}</p>
            </div>
          </div>
        </Grid>
        <Grid xs={7.5}>
          <p className="problem-title">{problemOfDay.question.title}</p>
          <Chip
            label={problemOfDay.question.difficulty}
            size="small"
            color={getColor(problemOfDay.question.difficulty)}
            variant="outlined"
            className="difficulty-chip"
            sx={{ height: "18px" }}
          />
          {displayTopics && <div className="topics-wrapper">{getTopics}</div>}
          <Button
            size="small"
            className={
              displayTopics ? "daily-show-topics-btn" : "show-topics-btn-margin"
            }
            onClick={() => setDisplayTopics((prev) => !prev)}
          >
            {displayTopics ? "Hide Topics" : "Show Topics"}
          </Button>
        </Grid>
      </Grid>
      <motion.div
        className="open-in-new-icon"
        onClick={() =>
          openInNewTab(LEETCODE_WEBSITE_URL.concat(problemOfDay.link))
        }
        whileHover={{
          scale: 1.05,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <OpenInNewIcon sx={{ fontSize: "20px" }} />
      </motion.div>
    </div>
  );
};

export default Daily;
