import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Markdown from "markdown-to-jsx";

type ExplanationProps = {
  correctAnswer: string;
  explanation: string;
};

const Explanation = ({ correctAnswer, explanation }: ExplanationProps) => (
  <Box>
    <Typography variant="h6" sx={{ marginBottom: 2 }}>
      Answer: {correctAnswer}
    </Typography>
    <Box sx={{ lineHeight: 1.5, fontSize: 16 }}>
      <Markdown>{explanation}</Markdown>
    </Box>
  </Box>
);

export default Explanation;
