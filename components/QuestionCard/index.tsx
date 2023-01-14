import Typography from '@mui/material/Typography';
import CustomMarkdown from './CustomMarkdown';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useEffect, useState } from 'react';
import { PrimaryButton } from './StyledComponents';
import Box from '@mui/material/Box';
import Explanation from '../Explanation';

type QuestionCardProps = {
  title: string;
  question: string;
  keyOptions: string[];
  correctAnswer: string;
  explain: string;
  id: number;
};

const extractExplaination = (initString: string) => {
  const pattern = '#### Answer: ';
  const startIndex = initString.indexOf(pattern);
  const endIndex = initString.indexOf('</p>');
  return initString.slice(startIndex + pattern.length + 1, endIndex);
};

const QuestionCard = ({
  title,
  question,
  keyOptions,
  correctAnswer,
  explain,
  id,
}: QuestionCardProps) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUserAnswerCorrect, setIsUserAnswerCorrect] = useState(false);
  const [isShownExplanation, setIsShownExplanation] = useState(false);
  const explanation = extractExplaination(explain);

  useEffect(() => {
    setUserAnswer('');
    setIsSubmitted(false);
    setIsUserAnswerCorrect(false);
    setIsShownExplanation(false);
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer((event.target as HTMLInputElement).value);
  };

  const handleSubmitAnswer = () => {
    setIsSubmitted(true);
    if (correctAnswer === userAnswer) {
      setIsUserAnswerCorrect(true);
    } else {
      setIsUserAnswerCorrect(false);
    }
  };

  const handleClickExplain = () => {
    setIsShownExplanation(true);
  };

  const isRightAns = (key: string) => key === correctAnswer;

  const getTextColor = (key: string, isSubmitted: boolean) => {
    if (
      !isSubmitted ||
      (isSubmitted && key !== userAnswer && !isRightAns(key))
    ) {
      return 'white';
    } else if (isRightAns(key) && isSubmitted) {
      return 'greenyellow';
    } else if (key === userAnswer && isSubmitted && !isUserAnswerCorrect) {
      return 'red';
    }
  };
  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: 2, color: 'white' }}>
        {title}
      </Typography>
      <CustomMarkdown text={question} />
      {!isShownExplanation ? (
        <FormControl>
          <RadioGroup value={userAnswer} onChange={handleChange}>
            {keyOptions.map((it) => (
              <FormControlLabel
                disabled={isSubmitted && correctAnswer !== it[2]}
                value={it[2]}
                key={it}
                control={
                  <Radio
                    sx={{
                      color: getTextColor(it[2], isSubmitted),
                      '&.Mui-checked': {
                        color: getTextColor(it[2], isSubmitted),
                      },
                      '&.Mui-disabled': {
                        color: getTextColor(it[2], isSubmitted),
                        opacity: 0.5,
                      },
                    }}
                  />
                }
                sx={{
                  color: getTextColor(it[2], isSubmitted),
                  '& .MuiFormControlLabel-label.Mui-disabled': {
                    color: 'inherit',
                    opacity: 0.5,
                  },
                }}
                label={<CustomMarkdown text={it.slice(1)} />}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ) : (
        <Box sx={{ color: 'white' }}>
          <Explanation
            correctAnswer={correctAnswer}
            explanation={explanation}
          />
        </Box>
      )}
      {userAnswer.length > 0 && (
        <Box>
          {isShownExplanation ? (
            <PrimaryButton
              disableRipple
              disableTouchRipple
              fullWidth
              variant="contained"
              onClick={() => setIsShownExplanation(false)}
            >
              Back
            </PrimaryButton>
          ) : (
            <PrimaryButton
              disableRipple
              disableTouchRipple
              fullWidth
              variant="contained"
              onClick={isSubmitted ? handleClickExplain : handleSubmitAnswer}
            >
              {isSubmitted ? 'Explain' : 'Submit'}
            </PrimaryButton>
          )}
        </Box>
      )}
    </>
  );
};

export default QuestionCard;
