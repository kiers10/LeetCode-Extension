import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { UserStats } from "../Interfaces";
import { LEETCODE_API_ENDPOINT } from "../Constants";
import { motion } from "framer-motion";

const USER_STATS_QUERY = `
query userSessionProgress($username: String!) {
    allQuestionsCount {
        difficulty
        count
    }
    matchedUser(username: $username) {
        submitStats {
            acSubmissionNum {
                difficulty
                count
            }
        }
    }
}`;

const SampleUserStats = {
  allQuestionsCount: [
    {
      difficulty: "All",
      count: 1,
    },
    {
      difficulty: "Easy",
      count: 1,
    },
    {
      difficulty: "Medium",
      count: 1,
    },
    {
      difficulty: "Hard",
      count: 1,
    },
  ],
  matchedUser: {
    submitStats: {
      acSubmissionNum: [
        {
          difficulty: "All",
          count: 0,
        },
        {
          difficulty: "Easy",
          count: 0,
        },
        {
          difficulty: "Medium",
          count: 0,
        },
        {
          difficulty: "Hard",
          count: 0,
        },
      ],
    },
  },
};

const User = () => {
  const [displayStats, setDisplayStats] = useState(false);
  const [username, setUsername] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [stats, setStats] = useState<UserStats>(SampleUserStats as UserStats);

  const [totalPercentage, setTotalPercentage] = useState(1);
  const [totalCompleted, setTotalCompleted] = useState(1);

  const [easyPercentage, setEasyPercentage] = useState(1);
  const [easyTotal, setEasyTotal] = useState(1);
  const [easyCompleted, setEasyCompleted] = useState(1);

  const [mediumPercentage, setMediumPercentage] = useState(1);
  const [mediumTotal, setMediumTotal] = useState(1);
  const [mediumCompleted, setMediumCompleted] = useState(1);

  const [hardPercentage, setHardPercentage] = useState(1);
  const [hardTotal, setHardTotal] = useState(1);
  const [hardCompleted, setHardCompleted] = useState(1);

  const fetchUserStats = async () => {
    console.log(`Fetching user stats from LeetCode API.`);

    const init = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: USER_STATS_QUERY,
        variables: {
          username: username,
        },
      }),
    };

    const response = await fetch(LEETCODE_API_ENDPOINT, init);
    const resData = await response.json();
    console.log(resData);
    if (resData.errors) {
      setHasError(true);
      setErrorMsg(resData.errors[0].message);
      return;
    }

    setStats(resData.data);
    setDisplayStats(true);
  };

  useEffect(() => {
    console.log(stats);

    const getPercentages = () => {
      for (let difficultyIdx = 0; difficultyIdx <= 3; difficultyIdx++) {
        const total = stats.allQuestionsCount[difficultyIdx].count;
        const completed =
          stats.matchedUser.submitStats.acSubmissionNum[difficultyIdx].count;

        if (difficultyIdx === 0) {
          setTotalCompleted(completed);
          setTotalPercentage((completed / total) * 100);
        } else if (difficultyIdx === 1) {
          setEasyTotal(total);
          setEasyCompleted(completed);
          setEasyPercentage((completed / total) * 100);
        } else if (difficultyIdx === 2) {
          setMediumTotal(total);
          setMediumCompleted(completed);
          setMediumPercentage((completed / total) * 100);
        } else if (difficultyIdx === 3) {
          setHardTotal(total);
          setHardCompleted(completed);
          setHardPercentage((completed / total) * 100);
        }
      }
    };

    getPercentages();
  }, [stats]);

  const handleSubmit = () => {
    if (!username) {
      setHasError(true);
      setErrorMsg("Please enter a username");
    } else {
      setHasError(false);
      setErrorMsg("");
      fetchUserStats();
    }
  };

  return (
    <>
      <div className="header">
        <p className="bold">LeetCode</p>
        <p>{displayStats && username}</p>
      </div>
      {displayStats ? (
        <div className="user-wrapper">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            paddingTop="4px"
          >
            <Box sx={{ position: "relative" }}>
              <CircularProgress
                variant="determinate"
                value={100}
                sx={{ color: "#242424" }}
                size="6rem"
              />
              <CircularProgress
                variant="determinate"
                value={totalPercentage}
                color="warning"
                size="6rem"
                sx={{ position: "absolute", left: 0 }}
              />
            </Box>
            <Box position="absolute">
              <Typography fontSize="18px" textAlign="center">
                {totalCompleted}
              </Typography>
              <Typography fontSize="12px" textAlign="center">
                Solved
              </Typography>
            </Box>
          </Box>

          <div className="user-difficulty-progress">
            <div className="easy-wrapper">
              <div className="user-difficulty-text-wrapper">
                <p className="user-difficulty-text bold">Easy</p>
                <p className="user-difficulty-text">
                  <span className="bold">{easyCompleted}</span> / {easyTotal}
                </p>
              </div>
              <LinearProgress
                variant="determinate"
                value={easyPercentage}
                color="success"
                sx={{
                  borderRadius: "5px",
                  height: "10px",
                }}
              />
            </div>
            <div className="medium-wrapper">
              <div className="user-difficulty-text-wrapper">
                <p className="user-difficulty-text bold">Medium</p>
                <p className="user-difficulty-text">
                  <span className="bold">{mediumCompleted}</span> /{" "}
                  {mediumTotal}
                </p>
              </div>
              <LinearProgress
                variant="determinate"
                value={mediumPercentage}
                color="warning"
                sx={{
                  borderRadius: "5px",
                  height: "10px",
                }}
              />
            </div>
            <div className="hard-wrapper">
              <div className="user-difficulty-text-wrapper">
                <p className="user-difficulty-text bold">Hard</p>
                <p className="user-difficulty-text">
                  <span className="bold">{hardCompleted}</span> / {hardTotal}
                </p>
              </div>
              <LinearProgress
                variant="determinate"
                value={hardPercentage}
                color="error"
                sx={{
                  borderRadius: "5px",
                  height: "10px",
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="no-user-wrapper box">
          <p
            style={{ fontSize: "14px", marginTop: "3px", marginBottom: "0px" }}
          >
            Enter your LeetCode username to see your statistics.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TextField
              id="standard-basic"
              label="Username"
              variant="standard"
              size="small"
              value={username}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(event.target.value);
              }}
              error={hasError}
              helperText={errorMsg}
            />
            <Button
              variant="outlined"
              color="warning"
              sx={{ fontSize: "10px", marginTop: "10px", marginLeft: "10px" }}
              component={motion.div}
              whileHover={{
                scale: 1.05,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default User;
